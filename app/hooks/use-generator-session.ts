"use client"

import { useEffect, useSyncExternalStore } from "react"
import type { GeneratorErrorCode } from "@/lib/generators/errors"
import type { GenerationMethod } from "@/lib/generators/types"
import { createGeneratorSession, INITIAL_SESSION_STATE } from "@/lib/session/generator-session"
import { optionsFromQuery, optionsQuery } from "@/lib/session/options-query"
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
 * the first time it's shown; a page without one, like Learn, generates nothing.
 * The page's URL holds that method's Options query, replaced as options change.
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
    if (!method) return

    if (!session.getState()[method].output) {
      // The first time the page is shown, options in its URL apply; afterwards the URL follows the session
      if (!location.search) session.generate(method)
      else if (method === "password") session.updatePasswordOptions(optionsFromQuery(method, location.search))
      else session.updatePassphraseOptions(optionsFromQuery(method, location.search))
    }

    const showOptionsInUrl = () => {
      const query = optionsQuery(method, session.getState()[method].options)
      const search = query && `?${query}`
      if (search !== location.search) history.replaceState(null, "", location.pathname + search + location.hash)
    }
    showOptionsInUrl()
    return session.subscribe(showOptionsInUrl)
  }, [method])

  return { state, session }
}
