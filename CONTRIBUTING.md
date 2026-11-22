# Contributing

Thanks for helping. Open an issue before starting anything larger than a small fix, so we can agree on the approach first.

Security problems go through a [private security advisory](https://github.com/git-leaf/passphrase-ua/security/advisories/new), never a public issue.

## Workflow

`main` is production: every merge to it deploys to Vercel. All work happens on short-lived branches that come back to `main` through a pull request. There is no `dev` branch, because every PR gets its own Vercel preview deployment.

1. **Start from an issue** for features, bugs and review findings. Small chores (typos, config tweaks) can go straight to a PR.
2. **Branch from `main`** as `<type>/<issue#>-<short-slug>`, where `<type>` is a Conventional Commit type (`feat`, `fix`, `refactor`, `docs`, `test`, `chore`, `ci`) and the issue number is optional, e.g. `feat/12-large-ukrainian-wordlist` or `fix/copy-button-focus`. `gh issue develop <n> --name <branch> --checkout` creates the branch and links it to the issue. Dependabot names its own branches.
3. **Run `pnpm check`** before pushing. CI runs the same command.
4. **Open a PR** with a Conventional Commit title (`feat: add large Ukrainian wordlist`) and `Closes #<n>` in the body. Branch commits use Conventional Commits too. The PR is squash-merged, and its title becomes the one commit on `main`.
5. **Check the Vercel preview** linked on the PR, then merge.

A ruleset protects `main` with no bypass, admins included: a PR must pass the `check` and `dependency-review` checks, commits are signed, and history stays linear through squash merges. In an emergency, an admin adds a bypass to the `main` ruleset, merges, and removes it again.

There are no releases, tags or changelog. The squashed history on `main` is the changelog.

## Conventions

Formatting, lint (including no `any`), types, tests and PR titles are checked by `pnpm check` and CI, because tooling is followed more reliably than prose. The rest:

- **pnpm only.** Commit the lockfile. pnpm refuses versions published less than 7 days ago, and Dependabot keeps dependencies current ([ADR-0003](docs/adr/0003-automatic-dependency-updates.md)). Run tools through pnpm (`pnpm exec tsc`, `pnpm vitest`): `npx` fails the `devEngines` Node check.
- **Pin GitHub Actions to a full commit SHA**, with the version in a comment. CI fails otherwise.
- **Domain logic lives in `lib/`** as deep modules (secure random, generators, wordlists, strength analysis, generator session) with small interfaces, alongside the translations and routes of `lib/i18n/`, which Strength analysis uses to word its units. `lib/` never imports React or Next.js; lint enforces it. `app/` holds the UI, the i18n and theme providers included, so the code that decides how strong a Secret is stays easy to test and audit. The one UI helper in `lib/` is `lib/utils.ts`, where shadcn/ui expects its class-name helper.
- **Tests sit next to the code** in a `__tests__` folder and use Vitest. Domain logic is tested directly; UI flows are tested through the rendered page with Testing Library, in files that start with `// @vitest-environment jsdom`. Fake only what the browser provides (network, clipboard), never the app's own modules. `pnpm check` fails when line coverage of `lib/` drops below 90%.
- **Use the words in [GLOSSARY.md](GLOSSARY.md)** for names in code, tests, issues and PRs. A missing term is a gap worth adding.
- **Record decisions in [docs/adr/](docs/adr/)** when they are hard to reverse, surprising without context and the result of a real trade-off.
- **Link the source** whenever docs or an ADR say how a third-party tool or service behaves.
- **Files and folders are kebab-case.** Use named exports, except where Next.js requires a default export (`page`, `layout` and other route files).
- **Every UI string goes through i18n**, in both English and Ukrainian.
