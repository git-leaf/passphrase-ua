# No analytics

Mova Pass runs no analytics, tracking or telemetry of any kind: no third-party scripts, no self-hosted counters, no error reporting. The privacy page promises this.

The app's whole case is that it collects nothing. Even consent-based, self-hosted analytics would make that promise conditional and add a script to audit. The original product requirements document (removed in #8) allowed opt-in, self-hosted analytics; this ADR replaces that.

## Considered options

- **Opt-in, self-hosted analytics (e.g. Plausible, Umami).** Rejected: the numbers wouldn't change any decision enough to be worth weakening "we collect nothing".

## Consequences

- Product decisions rely on issues, feedback and search data instead of usage numbers.
- Adding analytics later means superseding this ADR and changing the privacy page first.
