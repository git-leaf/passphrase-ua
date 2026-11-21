# GitHub Flow with squash-merged PRs, no dev branch

`main` is production, because Vercel deploys every merge to it. So every change goes through a short-lived branch and a pull request, even for a solo maintainer: the PR is where the required CI checks gate the merge, where the Vercel preview gets looked at before production, and where an issue links to the commit that closes it. PRs are squash-merged with a Conventional Commit title, so every commit on `main` is one complete, revertable change, and the history doubles as the changelog. There are no releases or tags.

## Considered options

- **Committing straight to `main`.** This was the practice until 2026-11. Rejected because CI could only report a failure after it was already live.
- **git-flow, or a long-lived `dev` branch.** Rejected: there is no release schedule and no QA stage to batch work for. Per-PR Vercel previews already give every change its own staging URL, and a second long-lived branch only drifts.
- **Rebase or merge commits.** Rejected: rebase-merging means every branch commit has to be tidied, and merge commits make history non-linear. Squash only requires the PR title to be right.

## Consequences

- Agents review a change in fresh sub-agents (spec, standards, correctness/security) **before** opening the PR, so the PR shows finished work and the maintainer stays the reviewer of record.
- Dependabot minor, patch, GitHub Actions and security updates auto-merge once checks pass, after a 7-day release cooldown that guards against hijacked packages. Major updates wait for the maintainer, because they can break the UI without failing CI.
