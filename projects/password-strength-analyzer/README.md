# Password Strength Analyzer

A small browser-based cybersecurity learning project. It evaluates a sample password using transparent heuristics and explains which checks passed.

## Run it

Open `index.html` in a modern browser. No package installation, account, or server is required.

To run the automated checks with Node.js:

```bash
node test.js
```

## Checks

- 12+ characters
- 16+ characters
- Mixed upper- and lowercase letters
- Numbers
- Symbols
- Common predictable words and sequences

## Privacy

Analysis happens in the browser. The page does not send or store the entered value. For safety, test only with a fictional password; never enter credentials used for a real account.

## Limitations

This is a demonstrative heuristic, not a cryptographic entropy estimator or a breached-password lookup. Its score is not a guarantee of security. It does not test password reuse, phishing risk, account MFA, or whether a password has appeared in a breach. The sequence and common-word check is intentionally small and cannot catch every predictable choice.

## Next improvements

- Add more adversarial test cases and edge-case tests.
- Add a transparent passphrase-length explanation.
- Add CI to run the tests on every push.
- Add a privacy review and accessibility check.

## Scope

For education and defensive security awareness only. This tool does not attempt to crack, collect, or transmit passwords.
