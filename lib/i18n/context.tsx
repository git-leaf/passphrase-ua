"use client"

import { createContext, useContext, type ReactNode } from "react"
import { translations, type Locale, type Translations } from "./translations"

interface I18nContextType {
  locale: Locale
  t: Translations
}

const I18nContext = createContext<I18nContextType | undefined>(undefined)

interface I18nProviderProps {
  children: ReactNode
  /** The page's language, from its URL */
  locale: Locale
}

/**
 * Provides the translations for the page's language
 */
export function I18nProvider({ children, locale }: I18nProviderProps) {
  return <I18nContext.Provider value={{ locale, t: translations[locale] }}>{children}</I18nContext.Provider>
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
