# AI-Assisted Creative Production Workflow

**Status: In progress — workflow specification. No automated end-to-end render is claimed yet.**

## Goal
Document a repeatable workflow where AI supports ideation or original asset generation, while a human remains responsible for the brief, editing choices, rights checks, and final quality approval.

## Proposed pipeline
1. **Brief:** capture audience, platform, duration, aspect ratio, message, tone, deliverables, and prohibited content.
2. **Plan:** produce a shot list, storyboard, copy, and asset checklist. Human reviews for clarity and originality.
3. **Generate/source:** create or source assets only where licence and usage terms are understood. Record provenance.
4. **Assemble:** edit in a creative tool; optionally use Remotion for code-driven motion or FFmpeg for supported media operations after validating the installed versions and commands.
5. **Export:** generate clearly named files for each requested aspect ratio and format.
6. **QA:** inspect duration, resolution, frame rate, audio, spelling, safe areas, visual consistency, and rights/provenance.
7. **Human sign-off:** record issues, fixes, and approval before delivery.

## Example manifest
The `production-manifest.example.json` file is a proposed job manifest, not a working agent integration. It records the brief, expected outputs, asset provenance, and QA checklist.

## Definition of done
- A reproducible input brief and documented steps
- At least one actual output asset
- Tool/version and export settings recorded
- QA results with defects and fixes
- Human approval explicitly recorded
- No claim that an AI agent, FFmpeg, or Remotion ran unless logs or output files prove it

## Safety and rights
Use original, public-domain, or properly licensed assets. Do not upload confidential client materials to third-party AI tools without permission. Review provider terms for commercial use and disclosure requirements. AI output always receives human review.

## Current evidence
This repository contains a proposed workflow and example manifest only. Build and test the actual production automation before calling this an implemented pipeline.
