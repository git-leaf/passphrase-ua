"use client"

import { useSyncExternalStore } from "react"
import Link from "next/link"
import { Languages } from "lucide-react"
import { Button } from "@/app/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/app/components/ui/dropdown-menu"
import { languageNames, locales, pagePath, rememberLocale, useI18n, type Page } from "@/lib/i18n"

function subscribeToHash(onChange: () => void) {
  window.addEventListener("hashchange", onChange)
  return () => window.removeEventListener("hashchange", onChange)
}

/**
 * Language toggle component with dropdown menu
 * Links to the same page in English and Ukrainian, and remembers the choice.
 * Section anchors are the same in both languages, so the link keeps the current one.
 */
export function LanguageToggle({ page }: { page: Page }) {
  const { locale, t } = useI18n()
  const hash = useSyncExternalStore(
    subscribeToHash,
    () => location.hash,
    () => "",
  )

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" aria-label={t.header.toggleLanguage}>
          <Languages className="h-[1.2rem] w-[1.2rem]" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {locales.map((language) => (
          <DropdownMenuItem key={language} asChild className={locale === language ? "bg-accent" : ""}>
            <Link
              href={pagePath(page, language) + hash}
              hrefLang={language}
              lang={language}
              onClick={() => rememberLocale(language)}
            >
              <span className="mr-2">{languageNames[language].flag}</span> {languageNames[language].name}
            </Link>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
