"use client"

import { useEffect, useSyncExternalStore } from "react"
import type { GeneratorErrorCode } from "@/lib/generators/errors"
import type { GenerationMethod } from "@/lib/generators/types"
import {
  createGeneratorSession,
  INITIAL_SESSION_STATE,
  type GeneratorSessionState,
} from "@/lib/session/generator-session"
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
 * How long options must settle before the URL shows them. Browsers limit how often
 * history may change, so a slider drag mustn't write every step. The wait also lets
 * the first write go through Next.js, which patches history.replaceState in an effect
 * of its router that runs after the page's own effects; a write before that would
 * drop the router's history state and break Back.
 */
const URL_UPDATE_DELAY_MS = 300

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

    let shown: GeneratorSessionState[typeof method]["options"] | undefined
    let pending: ReturnType<typeof setTimeout> | undefined
    const showOptionsInUrl = () => {
      const options = session.getState()[method].options
      if (options === shown) return
      shown = options
      clearTimeout(pending)
      pending = setTimeout(() => {
        const query = optionsQuery(method, options)
        const search = query && `?${query}`
        if (search !== location.search) history.replaceState(null, "", location.pathname + search + location.hash)
      }, URL_UPDATE_DELAY_MS)
    }
    showOptionsInUrl()
    const unsubscribe = session.subscribe(showOptionsInUrl)
    return () => {
      unsubscribe()
      clearTimeout(pending)
    }
  }, [method])

  return { state, session }
}
