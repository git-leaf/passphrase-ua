"use client"

import { Languages } from "lucide-react"
import { Button } from "@/app/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/app/components/ui/dropdown-menu"
import { useI18n } from "@/lib/i18n"

/**
 * Language toggle component with dropdown menu
 * Allows switching between English and Ukrainian
 */
export function LanguageToggle() {
  const { locale, setLocale } = useI18n()

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" aria-label="Toggle language">
          <Languages className="h-[1.2rem] w-[1.2rem]" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => setLocale("en")} className={locale === "en" ? "bg-accent" : ""}>
          <span className="mr-2">🇬🇧</span> English
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setLocale("uk")} className={locale === "uk" ? "bg-accent" : ""}>
          <span className="mr-2">🇺🇦</span> Українська
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

