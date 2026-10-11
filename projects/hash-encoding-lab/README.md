# Hash & Encoding Lab

A standalone browser-based learning tool demonstrating Base64 encoding/decoding and SHA-256 hashing.

## Run it

Open `index.html` in a modern browser. No package installation or backend is required. SHA-256 uses the browser Web Crypto API, normally available in secure contexts such as HTTPS and localhost.

## Demonstrations

- Encode text as Base64 using UTF-8 bytes, including non-ASCII text.
- Decode Base64 back to UTF-8 text, with clear error feedback for malformed input.
- Calculate a SHA-256 digest and display it as 64 hexadecimal characters.
- Move a result back into the input field to experiment with round trips.

## Security and privacy

Input processing runs in the browser; the page makes no network requests for entered text and does not persist it. Use harmless sample data only. Base64 is reversible encoding, not encryption. SHA-256 is a general-purpose one-way hash, not a password-storage scheme by itself. Production password storage should use a purpose-built password hashing function such as Argon2id, scrypt, or bcrypt with appropriate parameters and salts.

## Limitations

This is an educational demonstration, not a cryptographic service or security audit. Browser extensions or a compromised device may observe page content. The tool does not encrypt files, manage keys, connect to breach databases, or verify external data integrity.

## Scope

For education and defensive security awareness only.
