# Dependencies update themselves after a 7-day wait; majors wait for the maintainer

Dependabot opens weekly PRs for npm packages and GitHub Actions, with minor and patch updates grouped. Neither Dependabot nor pnpm takes a version until it has been published for 7 days: Dependabot through its `cooldown`, pnpm through `minimumReleaseAge`, which also covers anything a person or an agent installs by hand. Dependabot PRs for minor, patch and GitHub Actions updates get squash auto-merge and land as soon as the required checks pass. Major npm updates stay open until the maintainer asks for them to be handled. The maintainer does no weekly review.

The 7-day wait is there because a hijacked package release is usually spotted and pulled within days, and a short delay keeps us off it. Majors are held back because a major version can change the UI or behaviour without failing a single check, so someone has to look at the preview.

## Considered options

- **Auto-merge everything, majors included.** Rejected: this app's checks cover the domain logic, not the look and feel, so a breaking major could reach production unnoticed.
- **A weekly manual review of every update.** Rejected: the maintainer doesn't want recurring chores, and a skipped review means updates pile up.
- **Renovate.** Rejected: it is more configurable, but it is a third-party app with write access to the repo, while Dependabot is built into GitHub and already covers this policy.
- **No release-age wait.** Rejected: it is the cheapest defence against a hijacked release, and it costs only a week of freshness.

## Consequences

- GitHub Actions are pinned to full commit SHAs, with the version in a comment. A tag can be moved to point at other code and a SHA can't; Dependabot keeps the SHAs current.
- pnpm 12 also checks the lockfile against `minimumReleaseAge`, so a lockfile entry younger than 7 days fails the install, in CI and on Vercel. A security fix younger than that needs its package added to `minimumReleaseAgeExclude` in that PR, and removed once the fix is 7 days old.
- A Dependabot PR counts as a security update only when looked up against its Dependabot alert, and that lookup needs a personal access token the repo doesn't hold. So a security fix that is a minor or patch update merges by the normal rule, while one that is a major waits like any other major. The open Dependabot alert keeps it visible.
