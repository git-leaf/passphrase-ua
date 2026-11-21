# Dependencies update themselves after a 7-day wait; risky updates wait for the maintainer

Dependabot opens weekly PRs for npm packages and GitHub Actions, with minor and patch updates grouped. Neither Dependabot nor pnpm takes a version until it has been published for 7 days: Dependabot through its `cooldown`, pnpm through `minimumReleaseAge`, which also covers anything a person or an agent installs by hand. Dependabot PRs that update only GitHub Actions, npm patches, or npm minors from 1.0.0 up get squash auto-merge and land as soon as the required checks pass. Major npm updates, and minor updates of 0.x packages (which semver allows to break), stay open until the maintainer asks for them to be handled. The maintainer does no weekly review.

The 7-day wait is there because a hijacked package release is usually spotted and pulled within days, and a short delay keeps us off it. Risky updates are held back because they can change the UI or behaviour without failing a single check, so someone has to look at the preview.

This is the one exception to [ADR-0001](0001-github-flow-with-squash-merged-prs.md)'s rule that a person checks the Vercel preview before merging: for the updates that auto-merge, CI is the only gate.

## Considered options

- **Auto-merge everything, majors included.** Rejected: this app's checks cover the domain logic, not the look and feel, so a breaking major could reach production unnoticed.
- **A weekly manual review of every update.** Rejected: the maintainer doesn't want recurring chores, and a skipped review means updates pile up.
- **Renovate.** Rejected: it is more configurable, but it is a third-party app with write access to the repo, while Dependabot is built into GitHub and already covers this policy.
- **No release-age wait.** Rejected: it is the cheapest defence against a hijacked release, and it costs only a week of freshness.

## Consequences

- GitHub Actions are pinned to full commit SHAs, with the version in a comment, and CI fails on any action that isn't. A tag can be moved to point at other code and a SHA can't; Dependabot keeps the SHAs current.
- pnpm 12 also checks the lockfile against `minimumReleaseAge`, so a lockfile entry younger than 7 days fails the install, in CI and on Vercel. When a version must go in sooner (a security fix, say), its exact `name@version` goes in `minimumReleaseAgeExclude`. An exact-version entry trusts nothing else, and becomes inert once that version is 7 days old.
- Auto-merge is only as safe as the required checks on `main`. The workflow refuses to turn it on when `main` requires none, and turns it off again if anyone other than Dependabot pushes to the PR.
- A Dependabot PR counts as a security update only when looked up against its Dependabot alert, and that lookup needs a personal access token the repo doesn't hold. So a security fix that is a safe update by the rules above merges like any other, while a risky one waits. The open Dependabot alert keeps it visible.
