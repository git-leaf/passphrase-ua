/**
 * Wordlist source
 *
 * Loads Wordlists from the catalogue: reads the file, parses it, and
 * caches the result. Overlapping loads of the same Wordlist share one
 * read; a failed load is forgotten so the next one retries.
 */

import { GeneratorError } from "@/lib/generators/errors"
import { wordlistInfo, type WordlistChoice } from "./catalogue"
import type { Wordlist, WordlistEntry } from "./types"

/** Reads a wordlist file's text by its catalogue path. */
export type ReadText = (path: string) => Promise<string>

/** Reads wordlist files over HTTP from the app's public/ folder. */
export const fetchText: ReadText = async (path) => {
  const response = await fetch(path)
  if (!response.ok) {
    throw new Error(`HTTP ${response.status}`)
  }
  return response.text()
}

export interface WordlistSource {
  /**
   * @throws GeneratorError `wordlist-unavailable` if the file can't be read or has no words
   */
  load(choice: WordlistChoice): Promise<Wordlist>
}

export function createWordlistSource(readText: ReadText = fetchText): WordlistSource {
  const cache = new Map<string, Promise<Wordlist>>()

  return {
    load(choice) {
      const { path } = wordlistInfo(choice)
      const cached = cache.get(path)
      if (cached) return cached

      const wordlist = read(readText, path)
      cache.set(path, wordlist)
      wordlist.catch(() => {
        if (cache.get(path) === wordlist) cache.delete(path)
      })
      return wordlist
    },
  }
}

async function read(readText: ReadText, path: string): Promise<Wordlist> {
  let text: string
  try {
    text = await readText(path)
  } catch (error) {
    throw new GeneratorError(
      "wordlist-unavailable",
      `Failed to read wordlist ${path}: ${error instanceof Error ? error.message : String(error)}`,
    )
  }

  const entries = text.split("\n").flatMap(parseLine)
  if (entries.length === 0) {
    throw new GeneratorError("wordlist-unavailable", `Wordlist ${path} has no words`)
  }
  return { entries }
}

/**
 * Parses one line: "INDEX WORD [TRANSLITERATION]" for Diceware files,
 * "WORD [TRANSLITERATION]" otherwise. Comments and blank lines give nothing.
 */
function parseLine(line: string): WordlistEntry[] {
  const trimmed = line.trim()
  if (!trimmed || trimmed.startsWith("#")) return []

  const parts = trimmed.split(/\s+/)
  // A dice index is made only of the digits 1-6
  const [word, transliteration] = /^[1-6]+$/.test(parts[0]) ? parts.slice(1) : parts
  if (!word) return []

  return [transliteration ? { word, transliteration } : { word }]
}
