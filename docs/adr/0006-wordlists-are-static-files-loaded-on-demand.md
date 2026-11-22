# Wordlists are static files, loaded when first needed

Each Wordlist is a plain text file the site serves from `public/wordlists/`. The app fetches a Wordlist the first time a Passphrase needs it and keeps it in memory, instead of bundling all of them into the JavaScript.

Wordlists are public data, not secrets, so fetching one reveals nothing a visitor generates. Loading only the one in use keeps the first page load small; all eight together are about 840 KB. Plain files are also easy to read and verify against their sources.

## Considered options

- **Bundle every Wordlist into the JavaScript.** Rejected: every visitor would download every list, including the ones they never use.

## Consequences

- The first Passphrase from each Wordlist needs a network request. [ADR-0011](0011-offline-through-a-hand-written-service-worker.md) amends this decision: a service worker stores every Wordlist in the background after the first visit, while the page itself still loads only the one in use.
