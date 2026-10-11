# JobTrack — Job Application Tracker MVP

A browser-based application tracker for recording roles, companies, dates, statuses, follow-ups, optional job links, and notes.

## Features
- Add, search, and filter job applications.
- Update application status and delete individual entries.
- Dashboard counters for applications, applied roles, interviews/assessments, and offers.
- Export records to CSV.
- Basic required-field and URL validation.
- HTML escaping for user-provided values before display.
- Browser-local persistence.

## Run
Open [index.html](index.html) in a modern browser. No build step or third-party library is required.

## Privacy and limitations
Records are saved in `localStorage` in the current browser profile. They are not encrypted by this app, are not synced across devices, and may be visible to other people using the same browser profile. Do not store passwords, identity numbers, or other highly sensitive data. Exported CSV files contain the data in your tracker.

This is a **frontend MVP**. It does not connect to Indeed or LinkedIn, submit applications, or include a backend or multi-user authentication.

## Next engineering milestones
1. Add a backend API and relational schema.
2. Add authentication, authorisation, validation, and server-side ownership checks.
3. Add tests for CRUD, filtering, CSV escaping, and input validation.
4. Add deployment configuration and privacy/security review.

## Skills demonstrated
JavaScript CRUD workflows, browser storage, input validation, CSV export, filtering, accessible forms, and privacy-conscious documentation.
