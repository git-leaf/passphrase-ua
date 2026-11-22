import { describe, expect, it } from "vitest"
import type { GeneratorErrorCode } from "@/lib/generators/errors"
import type { GenerationMethod } from "@/lib/generators/types"
import { createWordlistSource, type ReadText } from "@/lib/wordlists/wordlist-source"
import { createGeneratorSession, type GeneratorSession } from "../generator-session"

const UK_WORDS = ["кіт", "пес", "сова", "лис"]
const EN_WORDS = ["acid", "acorn", "acre", "acts"]

const FILES: Record<string, string> = {
  "/wordlists/uk/wordlist.txt": "# Size: 4\nкіт kit\nпес pes\nсова sova\nлис lys\n",
  "/wordlists/uk/short_diceware.txt": "1111 кіт kit\n1112 пес pes\n1113 сова sova\n1114 лис lys\n",
  "/wordlists/en/eff_large_diceware.txt": EN_WORDS.map((w, i) => `1111${i + 1} ${w}`).join("\n"),
}

const readFiles: ReadText = async (path) => {
  const text = FILES[path]
  if (text === undefined) throw new Error(`no such file ${path}`)
  return text
}

function setup(readText: ReadText = readFiles) {
  const errors: GeneratorErrorCode[] = []
  const session = createGeneratorSession({
    wordlists: createWordlistSource(readText),
    onError: (code) => errors.push(code),
  })
  return { session, errors }
}

/** The text of a method's latest Secret */
function secretOf(session: GeneratorSession, method: GenerationMethod) {
  return session.getState()[method].secret?.secret
}

/** A promise you resolve from outside. */
function deferred<T>() {
  let resolve!: (value: T) => void
  const promise = new Promise<T>((r) => (resolve = r))
  return { promise, resolve }
}

describe("generator session", () => {
  it("starts with default options and no Secret for either method", () => {
    const { session } = setup()
    const state = session.getState()

    expect(state.password.options.length).toBe(16)
    expect(state.passphrase.options.wordlist).toEqual({ language: "uk", id: "wordlist" })
    expect(state.password.secret).toBeNull()
    expect(state.passphrase.secret).toBeNull()
  })

  it("keeps each method’s Secret separate", async () => {
    const { session } = setup()

    await session.generate("password")
    const password = session.getState().password.secret
    await session.generate("passphrase")

    expect(password?.secret).toHaveLength(16)
    expect(session.getState().password.secret).toBe(password)
    expect(secretOf(session, "passphrase")?.split("-")).toHaveLength(6)
  })

  it("regenerates the password when its options change", async () => {
    const { session } = setup()

    await session.updatePasswordOptions({ length: 24, includeSymbols: false })

    expect(secretOf(session, "password")).toMatch(/^[A-Za-z0-9]{24}$/)
  })

  it("regenerates the passphrase when its options change", async () => {
    const { session } = setup()

    await session.updatePassphraseOptions({ wordCount: 4, separator: "." })

    const words = secretOf(session, "passphrase")!.split(".")
    expect(words).toHaveLength(4)
    for (const word of words) expect(UK_WORDS).toContain(word)
  })

  it("uses the custom separator when the custom separator is chosen", async () => {
    const { session } = setup()

    await session.updatePassphraseOptions({ separator: "custom", customSeparator: "+" })

    expect(secretOf(session, "passphrase")!.split("+")).toHaveLength(6)
  })

  it("switches to the default wordlist of a newly chosen language", async () => {
    const { session } = setup()

    await session.setWordlistLanguage("en")

    expect(session.getState().passphrase.options.wordlist).toEqual({ language: "en", id: "eff-large" })
    for (const word of secretOf(session, "passphrase")!.split("-")) {
      expect(EN_WORDS).toContain(word)
    }
  })

  it("is pending while a wordlist loads", async () => {
    const english = deferred<string>()
    const { session } = setup((path) => (path.includes("/en/") ? english.promise : readFiles(path)))

    const switching = session.setWordlistLanguage("en")
    expect(session.getState().passphrase.pending).toBe(true)

    english.resolve(FILES["/wordlists/en/eff_large_diceware.txt"])
    await switching
    expect(session.getState().passphrase.pending).toBe(false)
  })

  it("ignores a slow passphrase that finishes after a newer one", async () => {
    const english = deferred<string>()
    const { session } = setup((path) => (path.includes("/en/") ? english.promise : readFiles(path)))

    const slow = session.setWordlistLanguage("en")
    await session.setWordlistLanguage("uk")
    english.resolve(FILES["/wordlists/en/eff_large_diceware.txt"])
    await slow

    for (const word of secretOf(session, "passphrase")!.split("-")) {
      expect(UK_WORDS).toContain(word)
    }
  })

  it("reports invalid options by code and clears the stale Secret", async () => {
    const { session, errors } = setup()
    await session.generate("password")

    await session.updatePasswordOptions({
      includeLowercase: false,
      includeUppercase: false,
      includeNumbers: false,
      includeSymbols: false,
    })

    expect(errors).toEqual(["no-character-classes"])
    expect(session.getState().password.secret).toBeNull()
  })

  it("reports a wordlist that cannot be loaded as wordlist-unavailable", async () => {
    const { session, errors } = setup(async () => {
      throw new Error("offline")
    })

    await session.generate("passphrase")

    expect(errors).toEqual(["wordlist-unavailable"])
    expect(session.getState().passphrase.pending).toBe(false)
  })

  it("notifies subscribers with a new state object on every change", async () => {
    const { session } = setup()
    const seen: unknown[] = []
    const unsubscribe = session.subscribe(() => seen.push(session.getState()))

    await session.generate("password")
    unsubscribe()
    await session.generate("password")

    expect(seen).toHaveLength(1)
    expect(seen[0]).not.toBe(session.getState())
  })
})
