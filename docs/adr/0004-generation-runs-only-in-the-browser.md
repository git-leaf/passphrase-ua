# Secrets are generated only in the browser, with no accounts and no server

Every Secret is generated in the visitor's browser and never leaves it. Mova Pass has no server-side generation, no user accounts, no cloud sync, no ads and no paid tier. The deployed site is static files: pages, scripts and Wordlists.

A password generator asks for trust it can't prove from the outside. Running only in the browser lets anyone check the promise themselves, in the source and in the browser's network tab, instead of taking it on faith. Without a server there's also nothing that could store or leak a Secret.

## Considered options

- **Server-side generation (an API).** Rejected: the visitor would have to trust that the server neither logs nor keeps Secrets, and nobody outside can check it.
- **Accounts with synced settings or history.** Rejected: they need a backend that holds personal data, which is the risk this app exists to avoid.

## Consequences

- Features that need a backend (sync, sharing a Secret, breach checks against a server) are off the table. Settings can live only in the browser or in the URL, never the Secret itself.
- The host still sees ordinary request metadata such as IP addresses, and the privacy page must say so (#27).
