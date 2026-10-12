# Threat Intelligence & IOC Analyzer

An offline, browser-based learning tool for triaging indicators of compromise (IOCs). Paste one indicator per line to classify common formats, spot limited review signals, deduplicate entries, and export a JSON analyst report.

## Run it

Open `index.html` in a modern browser. No package installation, server, API key, or network lookup is required. Run the automated tests with Node.js:

```bash
node projects/threat-intelligence-ioc-analyzer/test.js
```

## Supported indicators

- IPv4 addresses
- Domain names
- HTTP/HTTPS URLs
- MD5, SHA-1, and SHA-256 hash formats
- Blank lines and comments beginning with `#` are ignored; duplicates are collapsed.

## Analyst workflow

1. Preserve the source and context of each indicator.
2. Check syntax and remove duplicates.
3. Review the tool's explanation and identify what evidence is still missing.
4. Verify indicators with trusted threat-intelligence sources and your organisation's approved tooling.
5. Record source, timestamp, confidence, scope, and next steps before taking action.

## Useful external references

These are references for manual follow-up, not integrations or results produced by this application:

- [CISA Known Exploited Vulnerabilities Catalog](https://www.cisa.gov/known-exploited-vulnerabilities-catalog)
- [MITRE ATT&CK](https://attack.mitre.org/)
- [abuse.ch ThreatFox](https://threatfox.abuse.ch/)
- [Google Safe Browsing](https://safebrowsing.google.com/)

## Limitations and safe use

- All checks are local and heuristic. No DNS, HTTP, WHOIS, reputation, or malware lookups are made.
- Labels such as `review` and `context` are triage hints, not proof that an indicator is malicious or safe.
- IP address classification does not fully validate every reserved range or special-use address.
- Hash length identifies a likely format, not the file's identity or behaviour.
- Example indicators in the UI use documentation-reserved IP space and example domains.
- Do not paste confidential indicators or incident data into tools unless your organisation approves the handling method.

This project is for education and authorised defensive analysis.
