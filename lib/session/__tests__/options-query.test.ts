import { describe, expect, it } from "vitest"
import { INITIAL_SESSION_STATE } from "../generator-session"
import { optionsFromQuery, optionsQuery } from "../options-query"

const PASSPHRASE_DEFAULTS = INITIAL_SESSION_STATE.passphrase.options
const PASSWORD_DEFAULTS = INITIAL_SESSION_STATE.password.options

describe("options query", () => {
  it("holds only the Passphrase options that differ from the defaults", () => {
    const options = { ...PASSPHRASE_DEFAULTS, wordCount: 5, separator: "_" }

    expect(optionsQuery("passphrase", options)).toBe("words=5&sep=_")
    expect(optionsFromQuery("passphrase", "words=5&sep=_")).toEqual(options)
  })

  it("round-trips every Passphrase option", () => {
    const options = {
      wordCount: 8,
      wordlist: { language: "en", id: "eff-short" },
      separator: " ",
      customSeparator: "",
      capitalization: "random-word",
      includeNumber: true,
      useTransliteration: true,
    } as const

    const query = optionsQuery("passphrase", options)

    expect(query).toBe("words=8&lang=en&list=eff-short&translit=1&sep=+&caps=random-word&number=1")
    expect(optionsFromQuery("passphrase", query)).toEqual(options)
  })

  it("puts a custom Separator in the query as the Separator itself", () => {
    const options = { ...PASSPHRASE_DEFAULTS, separator: "custom", customSeparator: "+!" }

    const query = optionsQuery("passphrase", options)

    expect(query).toBe("sep=%2B%21")
    expect(optionsFromQuery("passphrase", query)).toEqual(options)
  })

  it("leaves out a language's own default Wordlist", () => {
    const options = { ...PASSPHRASE_DEFAULTS, wordlist: { language: "en", id: "eff-large" } } as const

    expect(optionsQuery("passphrase", options)).toBe("lang=en")
    expect(optionsFromQuery("passphrase", "lang=en")).toEqual(options)
  })

  it.each([
    ["no query", ""],
    ["unknown options", "foo=bar&secret=x"],
    ["too few words", "words=2"],
    ["too many words", "words=13"],
    ["a fractional word count", "words=5.5"],
    ["a word count that isn't a number", "words=five"],
    ["a word count with a sign", "words=+5"],
    ["an unknown language", "lang=de"],
    ["a Wordlist of the other language", "list=eff-short"],
    ["an unknown Capitalization style", "caps=shout"],
    ["a switch that is neither 1 nor 0", "number=true&translit=yes"],
    ["a Separator of four characters", "sep=----"],
    ["an option given twice, the first time invalid", "words=two&words=5"],
  ])("reads %s as the default Passphrase options", (_, query) => {
    expect(optionsFromQuery("passphrase", query)).toEqual(PASSPHRASE_DEFAULTS)
  })

  it("keeps the valid Passphrase options of a query with invalid ones", () => {
    expect(optionsFromQuery("passphrase", "words=99&lang=en&list=beale&caps=shout")).toEqual({
      ...PASSPHRASE_DEFAULTS,
      wordlist: { language: "en", id: "beale" },
    })
  })

  it("round-trips every Password option, leaving out the defaults", () => {
    const options = {
      length: 32,
      includeLowercase: true,
      includeUppercase: false,
      includeNumbers: true,
      includeSymbols: false,
      excludeAmbiguous: true,
    }

    const query = optionsQuery("password", options)

    expect(query).toBe("length=32&upper=0&symbols=0&unambiguous=1")
    expect(optionsFromQuery("password", query)).toEqual(options)
    expect(optionsQuery("password", PASSWORD_DEFAULTS)).toBe("")
  })

  it.each([
    ["no query", ""],
    ["a Password too short", "length=7"],
    ["a Password too long", "length=65"],
    ["a length that isn't a number", "length=long"],
    ["a switch that is neither 1 nor 0", "symbols=no&unambiguous=true"],
    ["every character class turned off", "lower=0&upper=0&numbers=0&symbols=0"],
  ])("reads %s as the default Password options", (_, query) => {
    expect(optionsFromQuery("password", query)).toEqual(PASSWORD_DEFAULTS)
  })

  it("accepts a Separator of three characters outside the Basic Multilingual Plane", () => {
    expect(optionsFromQuery("passphrase", "sep=🙂🙂🙂")).toEqual({
      ...PASSPHRASE_DEFAULTS,
      separator: "custom",
      customSeparator: "🙂🙂🙂",
    })
  })
})
