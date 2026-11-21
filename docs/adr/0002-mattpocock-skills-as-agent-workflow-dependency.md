# mattpocock-skills is the agent workflow, and AGENTS.md only extends it

Agents work through [mattpocock-skills](https://github.com/mattpocock/skills): issues, implementation, review and PR bodies. The repo declares that dependency in `.claude/settings.json` and configures the skills only through their own extension points (`docs/agents/`, CONTRIBUTING.md, GLOSSARY.md, ADRs). AGENTS.md is always loaded, so it holds only pointers and the glue the skills don't cover. It never restates a skill's procedure: a second copy would compete with the skill and drift away from it.

## Considered options

- **Describe the process in tool-neutral prose, with a skill-to-step table.** Rejected: it duplicates what the skills already say, and agents end up following one version or a mix of both.
- **A second methodology plugin (superpowers) alongside it.** Rejected: both claim the same steps (planning, TDD, review, finishing a branch). Superpowers is turned off for the maintainer instead of blacklisted per repo.
