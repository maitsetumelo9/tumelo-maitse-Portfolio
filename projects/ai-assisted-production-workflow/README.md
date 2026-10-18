# AI-Assisted Creative Production Workflow

**Status: working manifest validator and documented workflow; external AI-agent orchestration is not implemented.**

## Implemented
- JSON production manifest for deliverables, dimensions, durations, asset provenance, and QA states.
- Python validator using only the standard library.
- Unit tests for required fields, dimensions, duplicate outputs, asset usage review, and QA types.
- Human-review workflow and explicit limitations.

## Run it
From this directory with Python 3.9+:

```bash
python validate_manifest.py
python -m unittest -v
```

Pass a different manifest path as an optional argument: `python validate_manifest.py path/to/manifest.json`.

The validator distinguishes a structurally valid manifest from completed production. It reports pending QA instead of pretending the media has been reviewed.

## Workflow
1. **Brief:** define audience, message, platform, duration, aspect ratios, and prohibited content.
2. **Plan:** create a shot list and copy; get human approval.
3. **Generate/source:** use original or appropriately licensed assets and record provenance.
4. **Assemble:** edit in a creative tool. Remotion may support code-driven motion; FFmpeg may support media inspection/transcoding after commands and versions are tested.
5. **Export:** make requested deliverables with predictable names.
6. **QA:** check dimensions, duration, audio, spelling, safe areas, rights, and visual consistency.
7. **Sign-off:** a human reviews each output and records approval.

## Limitations
- This is not an autonomous AI agent and does not call Runway, Sora, Figma, Remotion, or FFmpeg.
- The 15-second promo is a browser animation, not an MP4 file.
- QA booleans remain false until someone actually checks the outputs.
- Passing validation does not prove creative quality, rights clearance, or delivery readiness.

## Rights and privacy
Use original, public-domain, or properly licensed assets. Do not upload confidential client materials to third-party AI tools without permission. Review provider terms for commercial use and disclosure requirements. AI-generated work still requires human review.
