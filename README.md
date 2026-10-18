# Tumelo Maitse — 0xDev Portfolio

[![Security Lab Tests](https://github.com/maitsetumelo9/tumelo-maitse-Portfolio/actions/workflows/log-analysis-tests.yml/badge.svg)](https://github.com/maitsetumelo9/tumelo-maitse-Portfolio/actions/workflows/log-analysis-tests.yml)
[![Creative Production Checks](https://github.com/maitsetumelo9/tumelo-maitse-Portfolio/actions/workflows/creative-workflow-tests.yml/badge.svg)](https://github.com/maitsetumelo9/tumelo-maitse-Portfolio/actions/workflows/creative-workflow-tests.yml)
[![GitHub Pages Deployment](https://github.com/maitsetumelo9/tumelo-maitse-Portfolio/actions/workflows/deploy-pages.yml/badge.svg)](https://github.com/maitsetumelo9/tumelo-maitse-Portfolio/actions/workflows/deploy-pages.yml)

**Focus:** cybersecurity learning, defensive security tooling, and full-stack development, with a separate set of original creative-production prototypes.

- **Portfolio:** https://maitsetumelo9.github.io/tumelo-maitse-Portfolio/
- **GitHub:** https://github.com/maitsetumelo9
- **Contact:** maitsetumelo9@gmail.com

## About

I build practical projects to strengthen my skills in programming, cybersecurity fundamentals, and secure application design. This repository separates working implementations from setup-required integrations and planned capabilities. A successful code check is not presented as proof of professional experience or of human creative approval.

## Security and development projects

### Working browser demos and offline labs

- **[Password Strength Analyzer](projects/password-strength-analyzer/README.md)** — browser-side password heuristics, explanation of checks, and Node.js tests.
- **[Hash & Encoding Lab](projects/hash-encoding-lab/README.md)** — Base64 encode/decode and SHA-256 hashing with the Web Crypto API.
- **[Network Recon Lab](projects/network-recon-lab/README.md)** — offline interpretation of fictional Nmap-style output and common ports; it does not scan networks.
- **[Log Analysis Dashboard](projects/log-analysis-dashboard/README.md)** — synthetic authentication-log analysis, five explainable detections, analyst notes, JSON/CSV reports, and tests.
- **[SOC Analyst Investigation Lab](projects/soc-analyst-investigation-lab/README.md)** — guided synthetic incidents, evidence timelines, investigation checklist, conclusions, and JSON reports.
- **[Threat Intelligence & IOC Analyzer](projects/threat-intelligence-ioc-analyzer/README.md)** — offline IOC parsing, deduplication, heuristic explanations, and JSON export; no live reputation lookups.
- **[Web Security Practice Lab](projects/web-security-practice-lab/README.md)** — safe offline simulations of XSS, SQL injection, and access-control concepts with remediation guidance.
- **[LearnLab Student Platform MVP](projects/student-learning-platform/README.md)** — browser-only lessons, quizzes, explanations, and local progress.

### Setup-required integration

- **[JobTrack Secure Application Tracker](projects/secure-job-tracker/README.md)** — Supabase Auth and PostgreSQL integration code, per-user row-level security migration, input validation, CSV export, and tests. Cloud functionality requires an active Supabase project and the migration to be applied; do not treat the cloud integration as live until verified.

## AI-enabled creative production

The following are original fictional concept projects. They are practical prototypes and production assets, not claimed client work. The deploy workflow renders the motion deliverables from the checked-in FFmpeg scripts and verifies their metadata before publishing the static site.

- **[AFTER THE SIGNAL — Entertainment Promo](projects/entertainment-supercut/README.md)** — 15-second browser animation, production notes, reproducible 12-second vertical silent MP4 render, and render script. The hosted MP4 is generated during deployment.
- **[AFTER THE SIGNAL — Motion + Static Campaign](projects/campaign-motion-static/README.md)** — responsive campaign studio, standalone SVG posters in vertical/square/landscape formats, six-second browser title card, and reproducible landscape MP4 render.
- **[AI-Assisted Production Workflow](projects/ai-assisted-production-workflow/README.md)** — runnable Python manifest validator, example manifest, unit tests, and CI checks. It is a production-checking utility, **not** an autonomous AI agent and does not call external AI services.

### Run locally

Open the linked HTML demos in a modern browser. For the Python workflow:

```bash
cd projects/ai-assisted-production-workflow
python validate_manifest.py
python -m unittest -v
```

To render the videos locally, install FFmpeg with libx264 and DejaVu Sans fonts, then run the shell scripts listed in each project's README. The GitHub Pages deployment also renders and checks the videos before publishing.

## Credentials and skills

Only add certificates with verified issuer/name details and dates. Skills listed in the portfolio represent learning and project practice; they are not a claim of senior or professional-level experience.

## Quality standard

Substantial projects should include working code or media, setup instructions, reproducible checks, limitations, and a clear security/rights scope. No fake scan results, fabricated qualifications, or unsupported claims of AI automation.
