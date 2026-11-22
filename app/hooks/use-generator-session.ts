"use client"

import { useEffect, useSyncExternalStore } from "react"
import type { GeneratorErrorCode } from "@/lib/generators/errors"
import type { GenerationMethod } from "@/lib/generators/types"
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
 * The app's Generator session, generating the Secret of the page's Generation method
 * the first time it's shown; a page without one, like Learn, generates nothing
 */
export function useGeneratorSession(method: GenerationMethod | null, onError: ErrorListener) {
  const state = useSyncExternalStore(session.subscribe, session.getState, () => INITIAL_SESSION_STATE)

  useEffect(() => {
    errorListeners.add(onError)
    return () => {
      errorListeners.delete(onError)
    }
  }, [onError])

  useEffect(() => {
    if (method && !session.getState()[method].output) session.generate(method)
  }, [method])

  return { state, session }
}
