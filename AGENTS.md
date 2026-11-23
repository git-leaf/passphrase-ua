Read [CONTRIBUTING.md](CONTRIBUTING.md) before changing anything: it holds the workflow and conventions. Name things with the terms in [GLOSSARY.md](GLOSSARY.md). Decisions and the reasons behind them live in `docs/adr/`.

## Working on a change

- Commit only on a branch named as CONTRIBUTING describes, cut from an up-to-date `main`. `main` changes only through a merged PR.
- Push, open a PR or merge only when the user asks. "Merge when green" means enable auto-merge: `gh pr merge --squash --auto`.
- Before opening a PR: `pnpm check` and `pnpm check:browser` pass, then the independent review below, then fixes.
- Write the PR body with the `mattpocock-skills:pr` skill, including `Closes #<n>`.
- One ticket per session: once its PR merges, the next step is `/clear`, then the next ticket.

## Independent review

Before opening a PR, review the branch diff against `main` in fresh sub-agents that get only the diff, the standards and the issue, never the reasoning that produced the change:

1. **Spec**: does the change do what the issue asks, with nothing missing and nothing extra?
2. **Standards**: does it follow CONTRIBUTING.md, GLOSSARY.md and the ADRs?
3. **Correctness and security**: bugs and edge cases, and for this app especially randomness, entropy, CSP and data handling.

In Claude Code, `mattpocock-skills:code-review` covers 1 and 2, and the built-in `/code-review` covers 3.

Fix every hard finding and rerun `pnpm check`. List the judgement calls you left unresolved under `## Open judgement calls` in the PR body, for the user to decide. Dependabot PRs and docs-only changes skip this review.

## Agent skills

This repo depends on [mattpocock-skills](https://github.com/mattpocock/skills), declared in `.claude/settings.json`. Its per-repo configuration lives in `docs/agents/`; follow each skill's own instructions, which this file only extends.

### Issue tracker

Issues are tracked in GitHub Issues (git-leaf/passphrase-ua) via the `gh` CLI. See `docs/agents/issue-tracker.md`.

### Triage labels

Default canonical labels: needs-triage, needs-info, ready-for-agent, ready-for-human, wontfix. See `docs/agents/triage-labels.md`.

### Domain docs

Single-context: one `GLOSSARY.md` and `docs/adr/` at the repo root. See `docs/agents/domain.md`.
