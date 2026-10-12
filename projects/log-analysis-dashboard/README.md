# Log Analysis Dashboard

An offline defensive-security learning tool that parses synthetic authentication events, correlates them with transparent detection rules, and produces incident-style findings. It runs entirely in the browser and makes no network requests.

## Features
- Validates ISO 8601 timestamps, IPv4 addresses, event types, and usernames.
- Five explainable rules:
  - `AUTH-01`: repeated failures from one source within five minutes.
  - `AUTH-02`: one source targets multiple accounts within ten minutes (possible password spraying).
  - `AUTH-03`: one account receives failures from multiple sources within ten minutes.
  - `AUTH-04`: successful login after repeated failures for the same account/source within fifteen minutes.
  - `IAM-01`: privilege-change events flagged for review.
- Incident severity and confidence labels, evidence, and recommended analyst actions.
- Three synthetic scenarios, summary metrics, chronological timeline, and JSON/CSV report export.
- Safe output escaping and automated tests using Node.js built-in assertions.

## Run the dashboard
Open [index.html](index.html) in a modern browser. No server, package installation, API key, or external dependency is required.

## Run automated tests
Requires Node.js 18 or newer; no npm dependencies are needed.

```bash
node projects/log-analysis-dashboard/test.js
```

Expected output: `All Log Analysis Dashboard tests passed.`

## Input format
One event per line:

```
timestamp,source_ip,event,username
2026-10-11T08:00:00Z,192.0.2.11,failed_login,alex
2026-10-11T08:00:10Z,192.0.2.11,successful_login,alex
```

Supported event types: `failed_login`, `successful_login`, `password_reset`, `account_locked`, `access_denied`, and `privilege_change`. This intentionally simple CSV-like format does not support commas inside fields.

## Analyst workflow
1. Load a scenario or paste an authorised, appropriately sanitised sample.
2. Review invalid lines and correct format problems.
3. Compare summary metrics and incident evidence.
4. Treat recommendations as investigation leads, not automatic verdicts.
5. Export the report and document the conclusion, false-positive checks, and next steps.

## Security scope and limitations
All bundled examples use synthetic events and documentation IP addresses. Detection rules are heuristics, not proof of compromise; they can produce false positives and miss activity. Time windows are simple timestamp comparisons over the supplied dataset, not streaming correlation. The tool has no authentication, server-side storage, alert delivery, IP reputation, enrichment, or production SIEM integration. Reports may contain usernames and IPs supplied by the user; do not paste secrets or sensitive personal data.

The implementation follows general OWASP logging principles: validate untrusted event data, record useful context, avoid exposing secrets, and treat alerts as leads requiring investigation. See the [OWASP Logging Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Logging_Cheat_Sheet.html).

## Skills demonstrated
JavaScript module design, log parsing, time-window correlation, explainable detection logic, input validation, safe HTML rendering, JSON/CSV export, unit tests, and security documentation.
