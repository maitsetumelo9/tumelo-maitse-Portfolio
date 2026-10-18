# AI-Assisted Creative Production Workflow

**Status: runnable local render-and-QA pipeline.** It validates the production manifest, checks that referenced source files exist, runs the two FFmpeg render scripts, verifies generated MP4 dimensions, duration, and presence of encoded audio with ffprobe, and writes a JSON report. It does not call an external AI model or claim autonomous AI-agent behaviour.

## Run it

Install Python 3.9+ and FFmpeg with libx264 and ffprobe. From the repository root:

```bash
python projects/ai-assisted-production-workflow/run_production.py --check-only
python projects/ai-assisted-production-workflow/run_production.py
python -m unittest discover -s projects/ai-assisted-production-workflow -v
```

The full run creates:
- `projects/entertainment-supercut/after-the-signal-teaser.mp4` — 12 seconds, 720 × 1280, H.264 video with AAC synthesized sound design.
- `projects/campaign-motion-static/campaign-motion-card.mp4` — 6 seconds, 1920 × 1080, silent H.264.
- `production-report.json` — expected-versus-actual metadata for each generated video.

The GitHub Pages deployment runs the same render scripts, checks both files' metadata, and publishes the generated MP4s alongside the static site. The pipeline is deterministic and does not need API keys.

## Workflow stages

1. **Brief and manifest:** record target formats, dimensions, duration, source provenance, and QA states.
2. **Source checks:** reject invalid manifest structure, missing referenced files, and unsafe output paths.
3. **Render:** invoke the checked-in FFmpeg scripts.
4. **Automated technical QA:** use ffprobe to verify video streams, dimensions, frame rate, duration, and file size.
5. **Report:** write machine-readable JSON results; fail the process if an export does not match its brief.
6. **Human sign-off:** review text, visual quality, safe areas, rights, audio presence, audible quality, rights, and suitability before treating the work as final.

## Limitations and rights

- This is a local production automation/QA utility, **not an autonomous AI agent** and does not call Runway, Sora, Figma, Remotion, or other AI services.
- Automated metadata checks cannot judge creative quality, spelling, accessibility, rights, or whether a visual looks good on a phone. Human review remains required.
- The videos are original motion-graphics concepts with original synthesized audio with no third-party footage or music.
- Do not upload confidential client material to third-party AI tools without permission. Review asset licences and provider terms before commercial use.
