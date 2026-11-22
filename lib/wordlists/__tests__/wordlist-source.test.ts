import { readFile } from "node:fs/promises"
import { join } from "node:path"
import { describe, expect, it } from "vitest"
import { wordlistIds, wordlistInfo, type WordlistChoice } from "../catalogue"
import { createWordlistSource, type ReadText } from "../wordlist-source"

/** Reads the real wordlist files the app serves from public/. */
const readPublicFile: ReadText = (path) => readFile(join(process.cwd(), "public", path), "utf8")

const allChoices: WordlistChoice[] = [
  ...wordlistIds("en").map((id) => ({ language: "en" as const, id })),
  ...wordlistIds("uk").map((id) => ({ language: "uk" as const, id })),
]

describe("wordlist source", () => {
  it.each(allChoices)("loads $language/$id with as many entries as the catalogue says", async (choice) => {
    const wordlist = await createWordlistSource(readPublicFile).load(choice)

    expect(wordlist.entries).toHaveLength(wordlistInfo(choice).size)
  })

  it("reads Diceware lines as word plus Transliteration, without the dice index", async () => {
    const wordlist = await createWordlistSource(readPublicFile).load({ language: "uk", id: "short" })

    expect(wordlist.entries[0]).toEqual({ word: "авто", transliteration: "avto" })
  })

  it("reads plain lines as word plus Transliteration", async () => {
    const wordlist = await createWordlistSource(readPublicFile).load({ language: "uk", id: "wordlist" })

    expect(wordlist.entries[0]).toEqual({ word: "абажур", transliteration: "abazhur" })
  })

  it("reads English Diceware lines as words without a Transliteration", async () => {
    const wordlist = await createWordlistSource(readPublicFile).load({ language: "en", id: "eff-short" })

    expect(wordlist.entries[0]).toEqual({ word: "acid" })
  })

  it("reads a file once even when loads overlap", async () => {
    let reads = 0
    const source = createWordlistSource((path) => {
      reads++
      return readPublicFile(path)
    })

    const choice: WordlistChoice = { language: "en", id: "eff-short" }
    const [first, second] = await Promise.all([source.load(choice), source.load(choice)])
    await source.load(choice)

    expect(reads).toBe(1)
    expect(second).toBe(first)
  })

  it("reports an unreadable file as wordlist-unavailable and retries on the next load", async () => {
    let attempts = 0
    const source = createWordlistSource(async (path) => {
      attempts++
      if (attempts === 1) throw new Error("network down")
      return readPublicFile(path)
    })
    const choice: WordlistChoice = { language: "en", id: "eff-short" }

    await expect(source.load(choice)).rejects.toMatchObject({ code: "wordlist-unavailable" })
    await expect(source.load(choice)).resolves.toMatchObject({ entries: expect.any(Array) })
  })

  // A response whose word count differs from the catalogue: a cut-off download, two files run
  // together, or an error page served with status 200
  it.each<[string, ReadText]>([
    [
      "a truncated file",
      async (path) => {
        const lines = (await readPublicFile(path)).split("\n")
        return lines.slice(0, lines.length / 2).join("\n")
      },
    ],
    ["a file with extra words", async (path) => `${await readPublicFile(path)}\nextra\n`],
    [
      "an HTML error page",
      async () => "<!DOCTYPE html>\n<html>\n<head><title>Not found</title></head>\n<body>Not found</body>\n</html>\n",
    ],
    ["a file with no words", async () => "# Name: Empty\n\n"],
  ])("reports %s as wordlist-unavailable", async (_, readText) => {
    await expect(createWordlistSource(readText).load({ language: "en", id: "eff-short" })).rejects.toMatchObject({
      code: "wordlist-unavailable",
    })
  })
})
