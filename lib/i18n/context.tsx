"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
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

/**
 * Detects the user's preferred language from browser settings
 */
function detectBrowserLanguage(): Locale | null {
  if (typeof window === "undefined") return null

  // Check navigator.languages first (preferred languages array)
  const languages = navigator.languages || [navigator.language]
  if (!languages) return null

  // Map browser language codes to supported locales
  for (const lang of languages) {
    const primaryLang = lang.split('-')[0].toLowerCase()
    if (primaryLang === "uk") return "uk"
    if (primaryLang === "en") return "en"
  }

  return null
}

/**
 * I18n Provider that manages language selection and provides translations
 */
export function I18nProvider({ children, defaultLocale = "en", storageKey = "locale" }: I18nProviderProps) {
  const [locale, setLocaleState] = useState<Locale>(defaultLocale)

  // Load locale on mount: user preference → browser preference → default
  useEffect(() => {
    // First priority: check if user manually changed language (localStorage exists)
    const saved = localStorage.getItem(storageKey) as Locale | null
    if (saved && (saved === "en" || saved === "uk")) {
      setLocaleState(saved)
      return
    }

    // Second priority: first visit - use browser language preference
    const browserLang = detectBrowserLanguage()
    if (browserLang) {
      setLocaleState(browserLang)
      return
    }

    // Third priority: default locale (already set in useState)
  }, [])

  // Save locale to localStorage when it changes
  const setLocale = (newLocale: Locale) => {
    setLocaleState(newLocale)
    localStorage.setItem(storageKey, newLocale)
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

