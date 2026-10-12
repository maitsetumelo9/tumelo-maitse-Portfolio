# Web Security Practice Lab

An offline, intentionally simplified learning lab for three common web security themes: cross-site scripting (XSS), SQL injection, and broken access control / IDOR. All scenarios use fictional inputs and local simulations. Nothing is sent to a server, no SQL is executed, and user input is never inserted into the page as HTML.

## Run it

Open `index.html` in a modern browser. Automated tests run with Node.js:

```bash
node projects/web-security-practice-lab/test.js
```

## Exercises

1. **XSS and output handling:** compare a deliberately unsafe HTML-string illustration with escaped output and text-only rendering.
2. **SQL injection:** inspect how string concatenation changes a query illustration, then compare a parameterized query. Neither query is executed.
3. **Access control / IDOR:** use two fictional users and two fictional reports to compare an insecure illustrative decision with a server-side ownership check.

## Learning goals

- Explain why untrusted input must not be interpreted as executable markup.
- Recognise why parameterized SQL queries are preferred to string concatenation.
- Understand that authentication and authorization are different controls.
- Document the vulnerability, impact, evidence, and remediation clearly.

## Scope and safety

This is a teaching simulator, not a real vulnerable website or a substitute for a security test. The "unsafe" paths are displayed as text only; the app does not run injected JavaScript, connect to a database, or access external targets. The access-control decision is a local illustration and must not be treated as production authorization code.

Use hands-on testing only on systems you own or have explicit permission to assess.
