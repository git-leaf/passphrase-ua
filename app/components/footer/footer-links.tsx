"use client"

import { Github, Mail } from "lucide-react"
import { useI18n } from "@/lib/i18n"

/**
 * Footer links for GitHub and contact information
 */
export function FooterLinks() {
  const { t } = useI18n()

  return (
    <div className="flex flex-col sm:flex-row items-center justify-center gap-4 text-sm text-muted-foreground border-t pt-6">
      <a
        href="https://github.com/git-leaf/passphrase-ua"
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center gap-2 hover:text-foreground transition-colors"
      >
        <Github className="h-4 w-4" />
        {t.footer.sourceCode}
      </a>
      <span className="hidden sm:inline">•</span>
      <a
        href="mailto:contact@example.com"
        className="flex items-center gap-2 hover:text-foreground transition-colors"
      >
        <Mail className="h-4 w-4" />
        {t.footer.contact}
      </a>
    </div>
  )
}

