# Tumelo Maitse — 0xDev Portfolio

**Focus:** cybersecurity learning, defensive security tooling, and full-stack development.

Portfolio site: https://maitsetumelo9.github.io/tumelo-maitse-Portfolio/  
GitHub: https://github.com/maitsetumelo9  
Contact: maitsetumelo9@gmail.com

## About

I am building practical projects to demonstrate my developing skills in programming, cybersecurity fundamentals, and secure application design. This repository distinguishes working implementations from planned work; a project is not described as complete until its code and documentation support that claim.

## Skills in progress

- HTML, CSS, JavaScript
- Python and SQL fundamentals
- React and Node.js
- Linux and networking fundamentals
- Defensive security concepts, security testing, and documentation

## Projects

### Working browser demos

- **[Password Strength Analyzer](projects/password-strength-analyzer/README.md)** — transparent password-strength heuristics, browser-side analysis, and a Node.js test script.
- **[Hash & Encoding Lab](projects/hash-encoding-lab/README.md)** — Base64 encode/decode and SHA-256 hashing with the Web Crypto API.
- **[Network Recon Lab](projects/network-recon-lab/README.md)** — offline interpretation of fictional Nmap-style output and common ports; it does not scan networks.
- **[Log Analysis Dashboard](projects/log-analysis-dashboard/README.md)** — validates synthetic authentication logs, correlates five explainable detections, captures analyst conclusions, exports reports, and includes automated tests.
- **[SOC Analyst Investigation Lab](projects/soc-analyst-investigation-lab/README.md)** — three guided synthetic incident cases, evidence timelines, an analyst checklist, investigation conclusions, JSON reports, and tests.
- **[Threat Intelligence & IOC Analyzer](projects/threat-intelligence-ioc-analyzer/README.md)** — offline IOC format triage, deduplication, heuristic explanations, JSON export, and automated tests; no reputation lookups.
- **[Web Security Practice Lab](projects/web-security-practice-lab/README.md)** — safe offline simulations of XSS, SQL injection, and access control with remediation guidance and automated tests.
- **[LearnLab Student Platform MVP](projects/student-learning-platform/README.md)** — lessons, quizzes, explanations, and browser-local progress.
- **[JobTrack Secure Application Tracker](projects/secure-job-tracker/README.md)** — Supabase Auth, PostgreSQL-backed application CRUD, per-user row-level security policies, input validation, safer CSV export, and automated tests. Requires an active Supabase project and the included SQL migration.

LearnLab remains a browser-only frontend MVP. JobTrack now includes the Supabase integration code and database migration, but its cloud features require configuration of an active Supabase project before they can be used.

## Run the password analyzer

Open `projects/password-strength-analyzer/index.html` in a modern browser. To run its tests with Node.js:

```bash
node projects/password-strength-analyzer/test.js
```

Read the project's README for its limitations and privacy notes.

## Run the hash and encoding lab

Open `projects/hash-encoding-lab/index.html` in a modern browser. SHA-256 requires a browser context that supports the Web Crypto API, normally HTTPS or localhost. Read its README for security notes and limitations.

## Credentials

Credentials should be listed only when the certificate details and issuer can be verified. This section will be expanded with accurate names, dates, and links or evidence where available.

## Development standard

Each substantial project should include a working implementation, setup instructions, test evidence, known limitations, and a clear statement of its security scope. No fake scan results, fabricated qualifications, or empty commits.
