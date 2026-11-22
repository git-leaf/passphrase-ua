# Wordlist files are plain text with a metadata header and the Transliteration inline

Every Wordlist file uses one format:

```text
# Name: Ukrainian Long Diceware Wordlist
# Format: INDEX WORD TRANSLITERATION
# Language: uk
# Transliteration: en
# Dice: 5
# Size: 7776

11111	абажур	abazhur
```

- Lines starting with `#` are metadata and are skipped by the parser. `Size` is the number of words. `Transliteration`, `Dice`, `Source` and `License` appear where they apply.
- Each other line is one word, optionally preceded by its Dice index and followed by its Transliteration, separated by whitespace.
- A Diceware Wordlist has a Dice index on every line; other Wordlists have none.

Storing the Transliteration next to each word, rather than computing it in the app, keeps it exactly as curated in diceware-ua. It also lets anyone verify a list without running code.

## Consequences

- The app's Wordlist catalogue lists each file with its size, and a test checks that every file parses to that size.
- A new Wordlist, in any language, uses this format.
