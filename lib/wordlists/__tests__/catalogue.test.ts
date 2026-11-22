import { readFile } from "node:fs/promises"
import { join } from "node:path"
import { describe, expect, it } from "vitest"
import { CAPITALIZATION_STYLES, DEFAULT_PASSPHRASE_OPTIONS, generatePassphrase } from "@/lib/generators/passphrase"
import { wordlistIds, wordlistInfo, type WordlistChoice } from "../catalogue"
import { createWordlistSource } from "../wordlist-source"

const allChoices: WordlistChoice[] = [
  ...wordlistIds("en").map((id) => ({ language: "en" as const, id })),
  ...wordlistIds("uk").map((id) => ({ language: "uk" as const, id })),
]

const wordlists = createWordlistSource((path) => readFile(join(process.cwd(), "public", path), "utf8"))

describe("wordlist catalogue", () => {
  it.each(allChoices)(
    "says $language/$id needs no Separator only when it makes Passphrases without one",
    async (choice) => {
      const wordlist = await wordlists.load(choice)
      const worksWithoutSeparator = CAPITALIZATION_STYLES.flatMap((capitalization) =>
        [false, true].map((useTransliteration) => {
          try {
            generatePassphrase(wordlist, {
              ...DEFAULT_PASSPHRASE_OPTIONS,
              separator: "",
              capitalization,
              useTransliteration,
            })
            return true
          } catch {
            return false
          }
        }),
      ).every(Boolean)

      expect(wordlistInfo(choice).prefixFree).toBe(worksWithoutSeparator)
    },
  )

  it("offers no Separator for the EFF Wordlists, where no word begins another", () => {
    const prefixFree = allChoices.filter((choice) => wordlistInfo(choice).prefixFree).map(({ id }) => id)

    expect(prefixFree).toEqual(["eff-large", "eff-short", "eff-short-2"])
  })
})

describe("Word pool of a real Wordlist", () => {
  it("counts the long Ukrainian Diceware list's 7,776 words as their 7,764 distinct Transliterations", async () => {
    const wordlist = await wordlists.load({ language: "uk", id: "long" })
    const options = { ...DEFAULT_PASSPHRASE_OPTIONS, separator: "_" }

    expect(generatePassphrase(wordlist, options).wordPoolSize).toBe(7776)
    expect(generatePassphrase(wordlist, { ...options, useTransliteration: true }).wordPoolSize).toBe(7764)
  })
})
