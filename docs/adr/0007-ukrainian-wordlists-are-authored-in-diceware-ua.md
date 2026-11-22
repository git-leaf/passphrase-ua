# Ukrainian Wordlists are authored in diceware-ua; this app ships copies

The Ukrainian Wordlists are written and curated in the sister repository [diceware-ua](https://github.com/git-leaf/diceware-ua), which holds the source lists, the notebooks and the curation tools. This app bundles copies under `public/wordlists/uk/` and doesn't edit them.

Curating a Wordlist (choosing common, unambiguous words and their Transliterations) is its own project, with its own tooling and audience. Other tools can use the lists without this app.

## Consequences

- A change to a Ukrainian Wordlist is made in diceware-ua first, then copied here. A fix made only here would be overwritten by the next copy.
- New Ukrainian Wordlists, such as a 6-dice one, start in diceware-ua.
