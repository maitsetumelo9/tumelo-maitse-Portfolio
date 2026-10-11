# Log Analysis Dashboard

An offline defensive-security demo that parses sample authentication events and flags source IPs with at least three failed-login events in the supplied dataset.

## Features
- Load synthetic sample data or paste newline-separated events.
- Validate each line and report skipped malformed records.
- Summarise parsed events, failed logins, unique source IPs, and rule alerts.
- Escape untrusted log fields before rendering them in the page.
- Show a basic event timeline and analyst guidance.

## Input format
`timestamp,source_ip,event,username`

Example:
`2026-10-11T08:00:00Z,192.0.2.11,failed_login,alex`

## Run
Open [index.html](index.html) in a modern browser. No server, API key, or external dependency is required.

## Detection rule and limitations
The demo flags an IP when it has three or more `failed_login` events in the pasted dataset. It does not use a sliding time window, enrich IP addresses, correlate users across sources, or send alerts. The sample is synthetic; documentation IP addresses are used. This is a learning heuristic, not a production SIEM.

## Skills demonstrated
Parsing and validating data, defensive detection logic, safe output encoding, basic metrics, and communicating false-positive limitations.
