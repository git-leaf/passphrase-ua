# Mova Pass

A client-side generator of passwords and Ukrainian/English passphrases that explains how strong each result is against a configurable attacker.

## Generation

**Secret**:
The single string a generation produces, either a Password or a Passphrase.
_Avoid_: result, output, generated password (when a passphrase is meant)

**Generation method**:
Which kind of Secret is produced: password or passphrase. Each method keeps its own options and its own latest Secret.
_Avoid_: mode, tab, type

**Password**:
A Secret made of characters drawn uniformly from a Character set.

**Character set**:
The union of the character classes (lowercase, uppercase, numbers, symbols) enabled for a Password, optionally minus ambiguous characters such as `0`/`O`/`l`/`1`.
_Avoid_: charset, alphabet

**Passphrase**:
A Secret made of words drawn uniformly from one Wordlist, joined by a Separator, with optional capitalization and an appended number.
_Avoid_: password (for this kind), phrase

**Separator**:
The string placed between the words of a Passphrase, either a preset or a custom one of up to three characters.
_Avoid_: delimiter

## Wordlists

**Wordlist**:
A fixed, ordered list of words in one language from which Passphrase words are drawn.
_Avoid_: dictionary

**Diceware**:
A Wordlist sized to a power of six (1,296 or 7,776 words) so each word maps to a roll of four or five dice.

**Dice index**:
The digits 1–6 before each word in a Diceware Wordlist file, giving the dice roll that selects the word (e.g. `11111`). The app reads past it; it draws words with secure random numbers, not dice.

**Wordlist catalogue**:
The set of Wordlists the app offers, per language, including which one is the default for each language.
_Avoid_: available wordlists, wordlist config

**Transliteration**:
The Latin-alphabet rendering of a Ukrainian word, used in a Passphrase instead of the Cyrillic word when the user turns it on.
_Avoid_: romanization, latinization

## Strength

**Entropy**:
The number of bits of uniform randomness in a Secret, counted only over the random choices the generator actually makes (characters, distinct words, the appended number).
_Avoid_: strength (when the number of bits is meant), score

**Combinations**:
The number of Secrets the same options could have produced, 2^Entropy.
_Avoid_: keyspace, possibilities

**Strength level**:
The named band an Entropy falls in: Weak (≤40 bits), Moderate (≤60), Strong (≤80), Very Strong (≤128) or Excessive (above 128).
_Avoid_: rating, grade

**Attacker model**:
The assumed adversary, described by a Guess rate and a Cost per 2^32 guesses; either a preset or custom values.
_Avoid_: threat model, attack scenario

**Guess rate**:
How many candidate Secrets the attacker can test per second.
_Avoid_: hash rate, speed

**Cost per 2^32 guesses**:
What the attacker pays, in US dollars, for each block of 2^32 guesses.

**Time to crack**:
The average time the Attacker model needs to find a Secret: half the Combinations divided by the Guess rate.
_Avoid_: crack time, brute-force time

**Cost to crack**:
The average money the Attacker model spends to find a Secret: half the Combinations priced at the Cost per 2^32 guesses.

**Strength analysis**:
The full description of a Secret's strength under one Attacker model: Strength level, Entropy, Combinations, Time to crack and Cost to crack.
_Avoid_: strength meter (that is the UI showing it), assessment
