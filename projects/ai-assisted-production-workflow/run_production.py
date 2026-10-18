#!/usr/bin/env python3
"""Run and verify the local creative render pipeline; no external AI services required."""
from __future__ import annotations

import argparse
import json
import subprocess
import sys
from datetime import datetime, timezone
from pathlib import Path
from typing import Any

PROJECT_DIR = Path(__file__).resolve().parent
ROOT = PROJECT_DIR.parents[1]


def load_json(path: Path) -> dict[str, Any]:
    return json.loads(path.read_text(encoding="utf-8"))


def safe_repo_path(relative: str) -> Path:
    candidate = (ROOT / relative).resolve()
    if candidate != ROOT and ROOT not in candidate.parents:
        raise ValueError(f"Path escapes repository root: {relative}")
    return candidate


def inspect_video(path: Path) -> dict[str, Any]:
    result = subprocess.run(
        [
            "ffprobe", "-v", "error", "-select_streams", "v:0",
            "-show_entries", "stream=width,height,r_frame_rate",
            "-show_entries", "format=duration,size",
            "-of", "json", str(path),
        ],
        check=True, capture_output=True, text=True,
    )
    data = json.loads(result.stdout)
    if not data.get("streams"):
        raise ValueError(f"No video stream found in {path}")
    stream = data["streams"][0]
    media = data.get("format", {})
    return {
        "width": int(stream["width"]),
        "height": int(stream["height"]),
        "frame_rate": stream.get("r_frame_rate"),
        "duration_seconds": float(media["duration"]),
        "size_bytes": int(media["size"]),
    }


def check_metadata(actual: dict[str, Any], expected: dict[str, Any]) -> list[str]:
    errors = []
    for field in ("width", "height"):
        if actual.get(field) != expected.get(field):
            errors.append(f"{field}: expected {expected.get(field)}, got {actual.get(field)}")
    duration = expected.get("duration_seconds")
    if duration is not None and abs(float(actual.get("duration_seconds", 0)) - float(duration)) > 0.15:
        errors.append(f"duration_seconds: expected {duration}, got {actual.get('duration_seconds')}")
    return errors


def main() -> int:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--manifest", type=Path, default=PROJECT_DIR / "production-manifest.json")
    parser.add_argument("--check-only", action="store_true", help="validate manifest and referenced source files without rendering")
    args = parser.parse_args()

    try:
        manifest_path = args.manifest.resolve()
        manifest = load_json(manifest_path)
    except (OSError, json.JSONDecodeError) as exc:
        print(f"ERROR: cannot load manifest: {exc}", file=sys.stderr)
        return 2

    # Import the project's existing schema/QA validator.
    sys.path.insert(0, str(PROJECT_DIR))
    from validate_manifest import validate  # pylint: disable=import-outside-toplevel

    errors = validate(manifest)
    if errors:
        print("PIPELINE CHECK: FAIL")
        print("\n".join(f"- {item}" for item in errors))
        return 1

    provenance = manifest.get("asset_provenance", [])
    for item in provenance:
        try:
            path = safe_repo_path(item["asset"])
        except (KeyError, ValueError) as exc:
            errors.append(str(exc))
            continue
        if not path.is_file():
            errors.append(f"Referenced source asset is missing: {item['asset']}")

    deliverables = manifest.get("brief", {}).get("deliverables", [])
    render_items = [item for item in deliverables if item.get("render_script") and item.get("output")]
    if not render_items:
        errors.append("No renderable deliverables declare both render_script and output.")

    for item in render_items:
        for key in ("render_script", "output"):
            try:
                path = safe_repo_path(item[key])
            except (KeyError, ValueError) as exc:
                errors.append(str(exc))
                continue
            if key == "render_script" and not path.is_file():
                errors.append(f"Render script is missing: {item[key]}")
            if key == "output" and not path.parent.is_dir():
                errors.append(f"Output directory is missing: {path.parent}")

    if errors:
        print("PIPELINE CHECK: FAIL")
        print("\n".join(f"- {item}" for item in errors))
        return 1

    if args.check_only:
        print("PIPELINE CHECK: PASS")
        print(f"Manifest: {manifest.get('project', 'unnamed')}")
        print(f"Referenced source assets: {len(provenance)}")
        print(f"Renderable video deliverables: {len(render_items)}")
        print("No media was rendered in check-only mode.")
        return 0

    report: dict[str, Any] = {
        "project": manifest.get("project"),
        "created_at_utc": datetime.now(timezone.utc).isoformat(),
        "pipeline_status": "render-checks-passed-human-review-pending",
        "render_results": [],
        "human_review": "Pending: visual quality, safe areas, rights, and final approval must be reviewed by a person.",
    }
    for item in render_items:
        script_path = safe_repo_path(item["render_script"])
        output_path = safe_repo_path(item["output"])
        output_path.parent.mkdir(parents=True, exist_ok=True)
        print(f"Rendering {item['name']} ...")
        subprocess.run(["bash", str(script_path), str(output_path)], cwd=ROOT, check=True)
        actual = inspect_video(output_path)
        metadata_errors = check_metadata(actual, item)
        result = {
            "name": item["name"],
            "output": item["output"],
            "expected": {key: item.get(key) for key in ("width", "height", "duration_seconds")},
            "actual": actual,
            "status": "pass" if not metadata_errors else "fail",
            "errors": metadata_errors,
        }
        report["render_results"].append(result)
        if metadata_errors:
            print(f"FAIL: {item['name']}: " + "; ".join(metadata_errors), file=sys.stderr)
        else:
            print(f"PASS: {item['name']} — {actual['width']}x{actual['height']}, {actual['duration_seconds']:.2f}s")

    report_path = PROJECT_DIR / "production-report.json"
    report_path.write_text(json.dumps(report, indent=2) + "\n", encoding="utf-8")
    print(f"Production report: {report_path.relative_to(ROOT)}")
    if any(item["status"] != "pass" for item in report["render_results"]):
        return 1
    print("Automated render checks passed. Human creative/rights review remains pending.")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
