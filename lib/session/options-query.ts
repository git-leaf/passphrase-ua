/**
 * Options query
 *
 * The query string of a generator page's URL, holding the options that differ
 * from the defaults so a configuration can be bookmarked and shared. It never
 * holds a Secret. Anything missing, unknown or invalid reads as the default.
 */

import { CAPITALIZATION_STYLES, PASSPHRASE_LIMITS } from "@/lib/generators/passphrase"
import { PASSWORD_LIMITS, passwordCharacterSet, toSymbolSet, type PasswordOptions } from "@/lib/generators/password"
import type { GenerationMethod } from "@/lib/generators/types"
import {
  DEFAULT_WORDLIST,
  wordlistIds,
  wordlistInfo,
  wordlistLanguages,
  type WordlistChoice,
} from "@/lib/wordlists/catalogue"
import {
  CUSTOM_SEPARATOR,
  INITIAL_SESSION_STATE,
  SEPARATOR_PRESETS,
  separatorOf,
  type GeneratorSessionState,
  type PassphraseSettings,
} from "./generator-session"

type MethodOptions<M extends GenerationMethod> = GeneratorSessionState[M]["options"]

const PASSPHRASE_DEFAULTS = INITIAL_SESSION_STATE.passphrase.options
const PASSWORD_DEFAULTS = INITIAL_SESSION_STATE.password.options

/**
 * A character a shared link could hide in a Separator: control, format (zero-width,
 * bidi overrides) or any space but the plain one, so what's shown is what's copied
 */
const UNSEEN_CHARACTER = /(?! )[\p{C}\p{Z}]/u

/** The query string, without "?", of the options that differ from the defaults */
export function optionsQuery<M extends GenerationMethod>(method: M, options: MethodOptions<M>): string {
  let values: Record<string, string>
  let defaults: Record<string, string>
  if (method === "password") {
    values = passwordValues(options as PasswordOptions)
    defaults = passwordValues(PASSWORD_DEFAULTS)
  } else {
    const settings = options as PassphraseSettings
    values = passphraseValues(settings)
    // A language's own default Wordlist goes without saying
    defaults = { ...passphraseValues(PASSPHRASE_DEFAULTS), list: DEFAULT_WORDLIST[settings.wordlist.language] }
  }

  const query = new URLSearchParams()
  for (const [key, value] of Object.entries(values)) {
    if (value !== defaults[key]) query.set(key, value)
  }
  return query.toString()
}

/** The options a query string holds, each one the default unless the query holds a valid value */
export function optionsFromQuery<M extends GenerationMethod>(method: M, query: string): MethodOptions<M> {
  const params = new URLSearchParams(query)
  return (method === "password" ? passwordFromParams(params) : passphraseFromParams(params)) as MethodOptions<M>
}

/** Each character class's switch in the Password options, and its key in the query */
const CHARACTER_CLASSES = [
  ["includeLowercase", "lower"],
  ["includeUppercase", "upper"],
  ["includeNumbers", "numbers"],
  ["includeSymbols", "symbols"],
] as const

function passwordValues(options: PasswordOptions): Record<string, string> {
  const values: Record<string, string> = { length: String(options.length) }
  for (const [option, key] of CHARACTER_CLASSES) values[key] = switchValue(options[option])
  values.symbolset = options.symbolSet
  values.unambiguous = switchValue(options.excludeAmbiguous)
  return values
}

function passwordFromParams(params: URLSearchParams): PasswordOptions {
  const options = { ...PASSWORD_DEFAULTS }
  options.length =
    parseInteger(params.get("length"), PASSWORD_LIMITS.minLength, PASSWORD_LIMITS.maxLength) ?? options.length
  for (const [option, key] of CHARACTER_CLASSES) options[option] = parseSwitch(params.get(key)) ?? options[option]
  options.excludeAmbiguous = parseSwitch(params.get("unambiguous")) ?? options.excludeAmbiguous
  const symbolSet = params.get("symbolset")
  if (symbolSet !== null && toSymbolSet(symbolSet) === symbolSet) options.symbolSet = symbolSet

  // Too small a Character set can't make a Password
  if (passwordCharacterSet(options).length < PASSWORD_LIMITS.minCharacters) {
    for (const [option] of CHARACTER_CLASSES) options[option] = PASSWORD_DEFAULTS[option]
  }
  return options
}

function passphraseValues(options: PassphraseSettings): Record<string, string> {
  return {
    words: String(options.wordCount),
    lang: options.wordlist.language,
    list: options.wordlist.id,
    translit: switchValue(options.useTransliteration),
    sep: separatorOf(options),
    caps: options.capitalization,
    number: switchValue(options.includeNumber),
  }
}

function passphraseFromParams(params: URLSearchParams): PassphraseSettings {
  const options = { ...PASSPHRASE_DEFAULTS }

  const language = oneOf(params.get("lang"), wordlistLanguages()) ?? PASSPHRASE_DEFAULTS.wordlist.language
  const id = oneOf(params.get("list"), wordlistIds(language)) ?? DEFAULT_WORDLIST[language]
  options.wordlist = { language, id } as WordlistChoice

  options.wordCount =
    parseInteger(params.get("words"), PASSPHRASE_LIMITS.minWords, PASSPHRASE_LIMITS.maxWords) ?? options.wordCount
  options.useTransliteration = parseSwitch(params.get("translit")) ?? options.useTransliteration
  options.capitalization = oneOf(params.get("caps"), CAPITALIZATION_STYLES) ?? options.capitalization
  options.includeNumber = parseSwitch(params.get("number")) ?? options.includeNumber

  const separator = params.get("sep")
  if (
    separator !== null &&
    [...separator].length <= PASSPHRASE_LIMITS.maxSeparatorLength &&
    !UNSEEN_CHARACTER.test(separator) &&
    (separator !== "" || wordlistInfo(options.wordlist).prefixFree)
  ) {
    if (oneOf(separator, SEPARATOR_PRESETS) !== null) options.separator = separator
    else Object.assign(options, { separator: CUSTOM_SEPARATOR, customSeparator: separator })
  }

  return options
}

/** A switch written as 1 or 0 */
function switchValue(on: boolean) {
  return on ? "1" : "0"
}

/** A switch written as 1 or 0, else null */
function parseSwitch(value: string | null): boolean | null {
  return value === "1" ? true : value === "0" ? false : null
}

/** A whole number from min to max written in digits, else null */
function parseInteger(value: string | null, min: number, max: number): number | null {
  if (value === null || !/^\d+$/.test(value)) return null
  const number = Number(value)
  return number >= min && number <= max ? number : null
}

/** The value if it is one of the allowed ones, else null */
function oneOf<T extends string>(value: string | null, allowed: readonly T[]): T | null {
  return allowed.includes(value as T) ? (value as T) : null
}
