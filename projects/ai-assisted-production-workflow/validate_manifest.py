#!/usr/bin/env python3
"""Validate a creative production manifest using Python's standard library."""
import json
import sys
from pathlib import Path

REQUIRED = ("project", "status", "brief", "asset_provenance", "qa_checklist")
QA_FIELDS = ("correct_dimensions", "duration_checked", "audio_checked", "text_and_spelling_checked", "safe_areas_checked", "rights_reviewed", "human_approved")


def validate(data):
    errors = []
    if not isinstance(data, dict):
        return ["Manifest root must be a JSON object."]
    for key in REQUIRED:
        if key not in data:
            errors.append(f"Missing required top-level key: {key}")
    brief = data.get("brief", {})
    if not isinstance(brief, dict):
        errors.append("'brief' must be an object.")
        brief = {}
    outputs = brief.get("deliverables", [])
    if not isinstance(outputs, list) or not outputs:
        errors.append("'brief.deliverables' must be a non-empty list.")
    else:
        names = set()
        for index, item in enumerate(outputs, 1):
            if not isinstance(item, dict):
                errors.append(f"Deliverable {index} must be an object.")
                continue
            name = item.get("name")
            if not isinstance(name, str) or not name.strip():
                errors.append(f"Deliverable {index} needs a name.")
            elif name in names:
                errors.append(f"Duplicate deliverable name: {name}")
            else:
                names.add(name)
            for field in ("width", "height"):
                value = item.get(field)
                if not isinstance(value, int) or isinstance(value, bool) or value <= 0:
                    errors.append(f"Deliverable {name or index}: {field} must be a positive integer.")
            duration = item.get("duration_seconds")
            if duration is not None and (not isinstance(duration, (int, float)) or isinstance(duration, bool) or duration <= 0):
                errors.append(f"Deliverable {name or index}: duration_seconds must be positive or null.")
    assets = data.get("asset_provenance", [])
    if not isinstance(assets, list):
        errors.append("'asset_provenance' must be a list.")
    else:
        for index, asset in enumerate(assets, 1):
            if not isinstance(asset, dict):
                errors.append(f"Asset provenance item {index} must be an object.")
            elif not asset.get("asset") or not asset.get("source"):
                errors.append(f"Asset provenance item {index} needs asset and source.")
            elif asset.get("usage_terms_reviewed") is not True:
                errors.append(f"Asset {asset.get('asset')}: usage terms are not marked reviewed.")
    qa = data.get("qa_checklist", {})
    if not isinstance(qa, dict):
        errors.append("'qa_checklist' must be an object.")
    else:
        for field in QA_FIELDS:
            if not isinstance(qa.get(field), bool):
                errors.append(f"QA field '{field}' must be true or false.")
    return errors


def main():
    path = Path(sys.argv[1]) if len(sys.argv) > 1 else Path(__file__).with_name("production-manifest.json")
    try:
        data = json.loads(path.read_text(encoding="utf-8"))
    except FileNotFoundError:
        print(f"ERROR: manifest not found: {path}", file=sys.stderr)
        return 2
    except json.JSONDecodeError as exc:
        print(f"ERROR: invalid JSON at line {exc.lineno}, column {exc.colno}: {exc.msg}", file=sys.stderr)
        return 2
    errors = validate(data)
    if errors:
        print("MANIFEST CHECK: FAIL")
        print("\n".join(f"- {error}" for error in errors))
        return 1
    print("MANIFEST CHECK: PASS")
    print(f"Project: {data.get('project', '(unnamed)')}")
    print(f"Deliverables: {len(data['brief']['deliverables'])}")
    incomplete = [field for field, value in data['qa_checklist'].items() if value is not True]
    print("QA still incomplete: " + ", ".join(incomplete) if incomplete else "All listed QA fields are complete.")
    print("Manifest validity does not prove that media exports or human QA are complete.")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
