# SOC Analyst Investigation Lab

A guided, browser-based practice lab for learning a repeatable Security Operations Center (SOC) investigation workflow.

## Features

- Three synthetic incident cases: multiple accounts targeted, success after repeated login failures, and privilege-change review.
- Event timeline and findings from the shared Log Analysis Dashboard detection engine.
- Analyst checklist for scope, evidence, alternative explanations, and proportionate response.
- Investigation conclusion, analyst notes, and recommended next steps.
- JSON report export containing case context, timeline, detections, assessment, and limitations.
- Responsive dark-green interface with no third-party dependencies or network calls.

## Run

Open `index.html` in a modern browser, choose a case, review the evidence and findings, complete the checklist, record a conclusion, and export the report.

The lab loads `../log-analysis-dashboard/detection-engine.js`; keep that shared file in place when hosting the project.

## Case files

- **CASE-001:** repeated failures across multiple accounts from one source; assess possible password spraying and alternative explanations.
- **CASE-002:** a successful login follows repeated failures; assess urgency while checking legitimate-user explanations.
- **CASE-003:** a privilege-change event requires validation against an approved request and surrounding audit records.

## Security and learning limitations

- All events use synthetic data and documentation-only IP ranges.
- Rules are simple heuristics, not a commercial SIEM and not proof of compromise.
- The lab does not connect to identity providers, ingest live telemetry, block addresses, or contact external services.
- Do not enter secrets, personal information, or logs you are not authorised to handle.
- Treat exported reports as potentially sensitive and store them appropriately.

## Analyst workflow

1. Define the alert scope and time range.
2. Review the timeline and evidence behind each detection.
3. Test the hypothesis against benign explanations and missing context.
4. Record a conclusion with an appropriate level of confidence.
5. Recommend verification and response steps; preserve evidence and follow organisational procedures.
6. Export the investigation report for review.

## Related project

See [Log Analysis Dashboard](../log-analysis-dashboard/README.md) for the shared detection engine, supported input format, detection rules, and automated tests.
