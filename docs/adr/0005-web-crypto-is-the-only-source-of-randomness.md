# The Web Crypto API is the only source of randomness

Every random choice (each character, each word, the appended number) comes from `crypto.getRandomValues()`, mapped to a range by rejection sampling so no value is more likely than another. There is no `Math.random()`, no seeded generator and no hand-written cryptography. If the API is missing, generation fails instead of falling back.

A predictable generator is the most damaging way a password tool can fail, and nobody can see it from the output. The browser's cryptographic generator is built in, audited, and needs no dependency.

## Considered options

- **A cryptography library.** Rejected: it adds supply-chain risk and solves nothing the built-in API doesn't.
- **A `Math.random()` fallback for old browsers.** Rejected: one weak Secret that looks strong is worse than an error.

## Consequences

- Entropy figures are honest only because every draw is uniform. Any new random choice must go through the same secure random module, with tests for its edges.
