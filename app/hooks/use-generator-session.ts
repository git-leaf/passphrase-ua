"use client"

import { useEffect, useSyncExternalStore } from "react"
import type { GeneratorErrorCode } from "@/lib/generators/errors"
import { createGeneratorSession, INITIAL_SESSION_STATE } from "@/lib/session/generator-session"
import { createWordlistSource } from "@/lib/wordlists/wordlist-source"

type ErrorListener = (code: GeneratorErrorCode) => void

const errorListeners = new Set<ErrorListener>()

// One session for the app; nothing is generated until the page mounts
const session = createGeneratorSession({
  wordlists: createWordlistSource(),
  onError: (code) => errorListeners.forEach((listener) => listener(code)),
})

/**
 * The app's Generator session, generating both Secrets on first mount
 */
export function useGeneratorSession(onError: ErrorListener) {
  const state = useSyncExternalStore(session.subscribe, session.getState, () => INITIAL_SESSION_STATE)

  useEffect(() => {
    errorListeners.add(onError)
    return () => {
      errorListeners.delete(onError)
    }
  }, [onError])

  useEffect(() => {
    if (!session.getState().password.output) session.generate("password")
    if (!session.getState().passphrase.output) session.generate("passphrase")
  }, [])

  return { state, session }
}
