"use client"

import * as React from "react"

// The storage key and the themes are shared with public/theme.js, which applies the theme before the first paint
const STORAGE_KEY = "theme"
const THEMES = ["dark", "light", "system"] as const

type Theme = (typeof THEMES)[number]

type ThemeProviderState = {
  theme: Theme
  setTheme: (theme: Theme) => void
}

const initialState: ThemeProviderState = {
  theme: "system",
  setTheme: () => null,
}

const ThemeProviderContext = React.createContext<ThemeProviderState>(initialState)

/** The stored theme, or "system" when none is stored, it isn't one of the themes or storage is blocked */
function storedTheme(): Theme {
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    return THEMES.find((theme) => theme === stored) ?? "system"
  } catch {
    return "system"
  }
}

function storeTheme(theme: Theme) {
  try {
    localStorage.setItem(STORAGE_KEY, theme)
  } catch {
    // Storage is blocked (cookies off, a sandboxed frame): the choice lasts until the page closes
  }
}

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = React.useState<Theme>(() => (typeof window !== "undefined" ? storedTheme() : "system"))

  React.useEffect(() => {
    const osTheme = window.matchMedia("(prefers-color-scheme: dark)")
    const apply = () => {
      const root = window.document.documentElement
      root.classList.remove("light", "dark")
      root.classList.add(theme === "system" ? (osTheme.matches ? "dark" : "light") : theme)
    }

    apply()
    if (theme !== "system") return
    // "System" follows the OS while the page is open
    osTheme.addEventListener("change", apply)
    return () => osTheme.removeEventListener("change", apply)
  }, [theme])

  const value = {
    theme,
    setTheme: (theme: Theme) => {
      storeTheme(theme)
      setTheme(theme)
    },
  }

  return <ThemeProviderContext.Provider value={value}>{children}</ThemeProviderContext.Provider>
}

export const useTheme = () => {
  const context = React.useContext(ThemeProviderContext)

  if (context === undefined) throw new Error("useTheme must be used within a ThemeProvider")

  return context
}
