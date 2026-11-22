/**
 * Generator session
 *
 * The options and latest Secret of each Generation method. Changing a
 * method's options regenerates its Secret, so what's shown always matches
 * what's selected. Framework-free: React reads it through subscribe/getState.
 */

import { errorCodeOf, type GeneratorErrorCode } from "@/lib/generators/errors"
import { DEFAULT_PASSPHRASE_OPTIONS, generatePassphrase, type PassphraseOptions } from "@/lib/generators/passphrase"
import { DEFAULT_PASSWORD_OPTIONS, generatePassword, type PasswordOptions } from "@/lib/generators/password"
import type { GeneratedSecret, GenerationMethod } from "@/lib/generators/types"
import type { RandomBytes } from "@/lib/random/secure-random"
import { DEFAULT_WORDLIST, type WordlistChoice, type WordlistLanguage } from "@/lib/wordlists/catalogue"
import type { WordlistSource } from "@/lib/wordlists/wordlist-source"

/** The preset separators */
export const SEPARATOR_PRESETS = ["-", "_", " ", ".", ""] as const

/** Chooses the custom separator instead of a preset */
export const CUSTOM_SEPARATOR = "custom"

export interface PassphraseSettings extends PassphraseOptions {
  wordlist: WordlistChoice
  /** A preset separator, or CUSTOM_SEPARATOR to use customSeparator */
  separator: string
  customSeparator: string
}

export interface GeneratorSessionState {
  password: { options: PasswordOptions; secret: GeneratedSecret | null }
  passphrase: { options: PassphraseSettings; secret: GeneratedSecret | null; pending: boolean }
}

export interface GeneratorSession {
  getState(): GeneratorSessionState
  subscribe(listener: () => void): () => void
  /** Generates a new Secret for the method with its current options */
  generate(method: GenerationMethod): Promise<void>
  updatePasswordOptions(patch: Partial<PasswordOptions>): Promise<void>
  updatePassphraseOptions(
    patch: Partial<Omit<PassphraseSettings, "wordlist">> & { wordlist?: WordlistChoice },
  ): Promise<void>
  /** Switches the passphrase to the language's default Wordlist */
  setWordlistLanguage(language: WordlistLanguage): Promise<void>
}

export interface GeneratorSessionDeps {
  wordlists: WordlistSource
  /** Called with the code of every failed generation */
  onError: (code: GeneratorErrorCode) => void
  /** Byte source; defaults to the platform CSPRNG */
  bytes?: RandomBytes
}

/** The separator the passphrase actually uses: the preset, or the custom one */
export function separatorOf(settings: PassphraseSettings): string {
  return settings.separator === CUSTOM_SEPARATOR ? settings.customSeparator : settings.separator
}

export const INITIAL_SESSION_STATE: GeneratorSessionState = {
  password: { options: DEFAULT_PASSWORD_OPTIONS, secret: null },
  passphrase: {
    options: {
      ...DEFAULT_PASSPHRASE_OPTIONS,
      wordlist: { language: "uk", id: DEFAULT_WORDLIST.uk },
      customSeparator: "",
    },
    secret: null,
    pending: false,
  },
}

export function createGeneratorSession({ wordlists, onError, bytes }: GeneratorSessionDeps): GeneratorSession {
  let state = INITIAL_SESSION_STATE
  const listeners = new Set<() => void>()
  // Only the latest passphrase request may update the state
  let latestPassphraseRequest = 0

  function setState(next: GeneratorSessionState) {
    state = next
    for (const listener of listeners) listener()
  }

  function generatePasswordNow() {
    let secret: GeneratedSecret | null = null
    try {
      secret = generatePassword(state.password.options, bytes)
    } catch (error) {
      onError(errorCodeOf(error))
    }
    setState({ ...state, password: { ...state.password, secret } })
  }

  async function generatePassphraseNow() {
    const request = ++latestPassphraseRequest
    const settings = state.passphrase.options
    setState({ ...state, passphrase: { ...state.passphrase, pending: true } })

    let secret: GeneratedSecret | null = null
    let failure: GeneratorErrorCode | null = null
    try {
      const wordlist = await wordlists.load(settings.wordlist)
      secret = generatePassphrase(wordlist, { ...settings, separator: separatorOf(settings) }, bytes)
    } catch (error) {
      failure = errorCodeOf(error)
    }

    if (request !== latestPassphraseRequest) return
    if (failure) onError(failure)
    setState({ ...state, passphrase: { ...state.passphrase, secret, pending: false } })
  }

  const session: GeneratorSession = {
    getState: () => state,

    subscribe(listener) {
      listeners.add(listener)
      return () => listeners.delete(listener)
    },

    async generate(method) {
      if (method === "password") generatePasswordNow()
      else await generatePassphraseNow()
    },

    async updatePasswordOptions(patch) {
      state = { ...state, password: { ...state.password, options: { ...state.password.options, ...patch } } }
      generatePasswordNow()
    },

    async updatePassphraseOptions(patch) {
      state = {
        ...state,
        passphrase: { ...state.passphrase, options: { ...state.passphrase.options, ...patch } },
      }
      await generatePassphraseNow()
    },

    setWordlistLanguage(language) {
      return session.updatePassphraseOptions({
        wordlist: { language, id: DEFAULT_WORDLIST[language] } as WordlistChoice,
      })
    },
  }

  return session
}
