"use client"

import { createContext, useContext, useState, useSyncExternalStore, type ReactNode } from "react"
import { resolvePreferredLocale } from "./preferred-locale"
import { translations, type Locale, type Translations } from "./translations"

interface I18nContextType {
  locale: Locale
  setLocale: (locale: Locale) => void
  t: Translations
}

const I18nContext = createContext<I18nContextType | undefined>(undefined)

interface I18nProviderProps {
  children: ReactNode
  defaultLocale?: Locale
  storageKey?: string
}

// The stored and browser preferences are only read, never observed for changes
const subscribeToNothing = () => () => {}

// Storage can be blocked (privacy settings, sandboxed frames) or full; the
// locale then falls back to the browser language and is not remembered
function readSavedLocale(storageKey: string): string | null {
  try {
    return localStorage.getItem(storageKey)
  } catch {
    return null
  }
}

function saveLocale(storageKey: string, locale: Locale) {
  try {
    localStorage.setItem(storageKey, locale)
  } catch {
    // The choice still applies for this visit
  }
}

function browserLanguages(): readonly string[] {
  return navigator.languages?.length ? navigator.languages : [navigator.language]
}

/**
 * I18n Provider that manages language selection and provides translations
 */
export function I18nProvider({ children, defaultLocale = "en", storageKey = "locale" }: I18nProviderProps) {
  // Server render and hydration use the default; the browser then switches to
  // the saved choice or browser language without a setState-in-effect re-render
  const preferredLocale = useSyncExternalStore(
    subscribeToNothing,
    () => resolvePreferredLocale(readSavedLocale(storageKey), browserLanguages(), defaultLocale),
    () => defaultLocale,
  )
  const [chosenLocale, setChosenLocale] = useState<Locale | null>(null)
  const locale = chosenLocale ?? preferredLocale

  const setLocale = (newLocale: Locale) => {
    setChosenLocale(newLocale)
    saveLocale(storageKey, newLocale)
  }

  const value: I18nContextType = {
    locale,
    setLocale,
    t: translations[locale],
  }

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>
}

/**
 * Hook to access i18n context
 */
export function useI18n() {
  const context = useContext(I18nContext)
  if (context === undefined) {
    throw new Error("useI18n must be used within an I18nProvider")
  }
  return context
}
