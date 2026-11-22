"use client"

import { useEffect } from "react"
import { localizedPaths } from "@/lib/i18n"
import { wordlistPaths } from "@/lib/wordlists/catalogue"

/**
 * Pages that open offline once the service worker holds them: every page in every
 * language, and the root and old /privacy URL, which pick the visitor's language
 */
const OFFLINE_PAGES = ["/", "/privacy", ...localizedPaths()]

// Switching language remounts the layout; the worker needs the list once per page load
let handedOver = false

/**
 * Registers the service worker that keeps the app working offline (public/sw.js)
 * and hands it what to keep: the pages, every Wordlist and the files this page loaded.
 */
export function OfflineSupport() {
  useEffect(() => {
    // In development a worker would serve stale code and fight hot reloading
    if (process.env.NODE_ENV === "development" || !("serviceWorker" in navigator)) return
    if (handedOver) return
    handedOver = true
    const { serviceWorker } = navigator
    serviceWorker
      .register("/sw.js")
      .then(() => serviceWorker.ready)
      .then((registration) => {
        const loaded = performance
          .getEntriesByType("resource")
          .map((entry) => entry.name)
          .filter((url) => new URL(url).origin === location.origin)
        // The message type is shared with public/sw.js
        registration.active?.postMessage({
          type: "cache-for-offline",
          urls: [...OFFLINE_PAGES, ...wordlistPaths(), ...loaded],
        })
      })
      .catch(() => {
        // Offline use is a bonus: without the worker the app still works online
      })
  }, [])

  return null
}
