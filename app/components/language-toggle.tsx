"use client"

import Link from "next/link"
import { Languages } from "lucide-react"
import { Button } from "@/app/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/app/components/ui/dropdown-menu"
import { pagePath, rememberLocale, useI18n, type Locale, type Page } from "@/lib/i18n"

const LANGUAGES: { locale: Locale; flag: string; name: string }[] = [
  { locale: "en", flag: "🇬🇧", name: "English" },
  { locale: "uk", flag: "🇺🇦", name: "Українська" },
]

/**
 * Language toggle component with dropdown menu
 * Links to the same page in English and Ukrainian, and remembers the choice
 */
export function LanguageToggle({ page }: { page: Page }) {
  const { locale, t } = useI18n()

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" aria-label={t.header.toggleLanguage}>
          <Languages className="h-[1.2rem] w-[1.2rem]" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {LANGUAGES.map((language) => (
          <DropdownMenuItem key={language.locale} asChild className={locale === language.locale ? "bg-accent" : ""}>
            <Link
              href={pagePath(page, language.locale)}
              hrefLang={language.locale}
              lang={language.locale}
              onClick={() => rememberLocale(language.locale)}
            >
              <span className="mr-2">{language.flag}</span> {language.name}
            </Link>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
