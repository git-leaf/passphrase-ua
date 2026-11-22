# Product principles: passphrase first, visit to copy in seconds, depth on demand

Mova Pass is designed by these principles:

1. **Passphrase first.** A Passphrase is the product; a Password is a secondary feature. The home page in each language is the Passphrase generator.
2. **Visit → copy → leave.** A strong Secret is already shown when the page opens, and copying it takes one click. A visitor needs zero to two clicks and no decisions.
3. **Design for the least technical visitor.** Assume no attention to spare and no security knowledge: plain words, no jargon on the first screen, defaults chosen per language so that the default Secret is the right one.
4. **Depth on demand, never removed.** Every option, the Attacker model and the full Strength analysis stay available behind progressive disclosure (a "customize" or "details" step), so experienced visitors keep full control. Simplifying hides depth; it doesn't delete it.

A generator only helps if people use it, and most visitors want a strong Secret now, not a lesson. The Ukrainian Passphrase is what sets Mova Pass apart, so it leads.

## Considered options

- **Show every option up front, as before.** Rejected: it asks every visitor to make decisions most of them can't judge, and some leave or pick weaker settings.
- **A simplified app that drops advanced features.** Rejected: it would lose the experienced users and the explanations that make the app trustworthy.

## Consequences

- #19 redesigns the generator around these principles, including per-language defaults.
- New features land behind disclosure unless most visitors need them.
- Each page's URL leads with the Passphrase (#20), and non-default options can live in the URL (#22).
