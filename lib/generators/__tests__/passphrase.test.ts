import { describe, expect, it } from "vitest"
import type { RandomBytes } from "@/lib/random/secure-random"
import type { Wordlist } from "@/lib/wordlists/types"
import { DEFAULT_PASSPHRASE_OPTIONS, generatePassphrase, type PassphraseOptions } from "../passphrase"

const fourWords: Wordlist = {
  entries: [
    { word: "кіт", transliteration: "kit" },
    { word: "пес", transliteration: "pes" },
    { word: "сова", transliteration: "sova" },
    { word: "лис", transliteration: "lys" },
  ],
}

const options: PassphraseOptions = {
  ...DEFAULT_PASSPHRASE_OPTIONS,
  wordCount: 3,
  separator: "-",
  capitalization: "none",
  includeNumber: false,
  useTransliteration: false,
}

/** A byte source that hands out the given bytes in order. */
function fixedBytes(...values: number[]): RandomBytes {
  const queue = [...values]
  return (buffer) => {
    for (let i = 0; i < buffer.length; i++) {
      const next = queue.shift()
      if (next === undefined) throw new Error("fixedBytes exhausted")
      buffer[i] = next
    }
  }
}

describe("generatePassphrase", () => {
  it("picks words by index and joins them with the separator", () => {
    const { secret } = generatePassphrase(fourWords, options, fixedBytes(0, 1, 2))

    expect(secret).toBe("кіт-пес-сова")
  })

  it("uses the Transliteration when asked", () => {
    const { secret } = generatePassphrase(fourWords, { ...options, useTransliteration: true }, fixedBytes(0, 1, 3))

    expect(secret).toBe("kit-pes-lys")
  })

  it.each([
    ["first", "Кіт-Пес-Сова"],
    ["all", "КІТ-ПЕС-СОВА"],
  ] as const)("capitalizes with style %s", (capitalization, expected) => {
    const { secret } = generatePassphrase(fourWords, { ...options, capitalization }, fixedBytes(0, 1, 2))

    expect(secret).toBe(expected)
  })

  it("uppercases one randomly chosen word with style random-word", () => {
    // Words 0, 1, 2, then byte 1 picks the second word
    const { secret } = generatePassphrase(
      fourWords,
      { ...options, capitalization: "random-word" },
      fixedBytes(0, 1, 2, 1),
    )

    expect(secret).toBe("кіт-ПЕС-сова")
  })

  it("appends a zero-padded four-digit number after the separator", () => {
    // Words 0, 1, 2, then two bytes 0x00 0x07 make the number 7
    const { secret } = generatePassphrase(
      fourWords,
      { ...options, includeNumber: true },
      fixedBytes(0, 1, 2, 0x00, 0x07),
    )

    expect(secret).toBe("кіт-пес-сова-0007")
  })

  it("reports entropy as words × log2(wordlist size), plus log2(10^4) for the number", () => {
    expect(generatePassphrase(fourWords, options).entropy).toBeCloseTo(6)
    expect(generatePassphrase(fourWords, { ...options, includeNumber: true }).entropy).toBeCloseTo(6 + 13.2877, 3)
  })

  it("counts only distinct words when Transliterations collide", () => {
    const collidingTransliterations: Wordlist = {
      entries: [
        { word: "а", transliteration: "a" },
        { word: "б", transliteration: "b" },
        { word: "в", transliteration: "b" },
        { word: "г", transliteration: "h" },
      ],
    }

    const { entropy } = generatePassphrase(collidingTransliterations, {
      ...options,
      useTransliteration: true,
    })

    expect(entropy).toBeCloseTo(3 * Math.log2(3))
  })

  it("leaves out words that contain the Separator", () => {
    const hyphenated: Wordlist = { entries: [{ word: "чат-бот" }, { word: "кіт" }, { word: "пес" }] }

    // Every byte picks index 0, which is "кіт" once "чат-бот" is gone
    const generated = generatePassphrase(hyphenated, options, fixedBytes(0, 0, 0))

    expect(generated.secret).toBe("кіт-кіт-кіт")
    expect(generated.wordPoolSize).toBe(2)
    expect(generated.entropy).toBeCloseTo(3)
  })

  it("keeps words that contain a Separator other than the chosen one", () => {
    const hyphenated: Wordlist = { entries: [{ word: "чат-бот" }, { word: "кіт" }, { word: "пес" }] }

    expect(generatePassphrase(hyphenated, { ...options, separator: "_" }).wordPoolSize).toBe(3)
  })

  it("leaves out words the Separator could be found across, so every Passphrase splits one way", () => {
    // Next to "aa", a word that starts or ends with "a" makes "aaa", which splits two ways
    const overlapping: Wordlist = { entries: [{ word: "a" }, { word: "ab" }, { word: "ba" }, { word: "bb" }] }

    expect(
      generatePassphrase({ entries: [...overlapping.entries, { word: "bab" }] }, { ...options, separator: "aa" })
        .wordPoolSize,
    ).toBe(2)
    expect(() => generatePassphrase(overlapping, { ...options, separator: "aa" })).toThrow(
      expect.objectContaining({ code: "separator-in-words" }),
    )
  })

  it.each(["first", "all", "random", "random-word"] as const)(
    "counts words that differ only in case once with style %s",
    (capitalization) => {
      const caseVariants: Wordlist = { entries: [{ word: "Київ" }, { word: "київ" }, { word: "пес" }] }

      expect(generatePassphrase(caseVariants, { ...options, capitalization }).wordPoolSize).toBe(2)
    },
  )

  it("keeps words that differ only in case when capitalization leaves them as they are", () => {
    const caseVariants: Wordlist = { entries: [{ word: "Київ" }, { word: "київ" }, { word: "пес" }] }

    expect(generatePassphrase(caseVariants, options).wordPoolSize).toBe(3)
  })

  it("leaves out words that contain the Separator in another case once capitalization changes case", () => {
    const words: Wordlist = { entries: [{ word: "cat" }, { word: "dog" }, { word: "owl" }] }

    expect(generatePassphrase(words, { ...options, separator: "A", capitalization: "all" }).wordPoolSize).toBe(2)
    expect(generatePassphrase(words, { ...options, separator: "A" }).wordPoolSize).toBe(3)
  })

  it("allows no Separator when no word begins another", () => {
    const generated = generatePassphrase(fourWords, { ...options, separator: "" }, fixedBytes(0, 1, 2))

    expect(generated.secret).toBe("кітпессова")
    expect(generated.wordPoolSize).toBe(4)
  })

  it.each<[string, Wordlist, boolean]>([
    ["one word begins another", { entries: [{ word: "кіт" }, { word: "кітель" }, { word: "пес" }] }, false],
    [
      "one Transliteration begins another",
      {
        entries: [
          { word: "кіт", transliteration: "kit" },
          { word: "кітель", transliteration: "kitel" },
        ],
      },
      true,
    ],
    ["one word begins another but for case", { entries: [{ word: "Ab" }, { word: "abc" }] }, false],
  ])("rejects no Separator with separator-required when %s", (_, wordlist, useTransliteration) => {
    expect(() =>
      generatePassphrase(wordlist, { ...options, separator: "", useTransliteration, capitalization: "first" }),
    ).toThrow(expect.objectContaining({ code: "separator-required" }))
  })

  it("rejects a Separator that leaves fewer than two words with separator-in-words", () => {
    const mostHaveA: Wordlist = { entries: [{ word: "cat" }, { word: "bat" }, { word: "dog" }] }

    expect(() => generatePassphrase(mostHaveA, { ...options, separator: "a" })).toThrow(
      expect.objectContaining({ code: "separator-in-words" }),
    )
  })

  it.each([2, 13, 4.5])("rejects %s words with invalid-word-count", (wordCount) => {
    expect(() => generatePassphrase(fourWords, { ...options, wordCount })).toThrow(
      expect.objectContaining({ code: "invalid-word-count" }),
    )
  })

  it("rejects a separator longer than three characters with invalid-separator", () => {
    expect(() => generatePassphrase(fourWords, { ...options, separator: "----" })).toThrow(
      expect.objectContaining({ code: "invalid-separator" }),
    )
  })
})
