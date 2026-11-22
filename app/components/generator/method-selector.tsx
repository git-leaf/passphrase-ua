"use client"

import Link from "next/link"
import { pagePath, useI18n, type Page } from "@/lib/i18n"

/** The pages the method selector moves between */
export type GeneratorView = Exclude<Page, "privacy">

const VIEWS: GeneratorView[] = ["passphrase", "password", "learn"]

/**
 * Links between the Passphrase generator, the Password generator and Learn,
 * styled as tabs, with the current page marked
 */
export function MethodSelector({ current }: { current: GeneratorView }) {
  const { locale, t } = useI18n()

  return (
    <nav className="mb-6 grid w-full grid-cols-3 rounded-lg bg-muted p-[3px] text-muted-foreground">
      {VIEWS.map((view) => (
        <Link
          key={view}
          href={pagePath(view, locale)}
          aria-current={view === current ? "page" : undefined}
          className="inline-flex items-center justify-center rounded-md border border-transparent px-2 py-2 text-center text-sm font-medium text-foreground transition-[color,box-shadow] focus-visible:border-ring focus-visible:outline-1 focus-visible:outline-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 aria-[current=page]:bg-background aria-[current=page]:shadow-sm sm:text-base dark:text-muted-foreground dark:aria-[current=page]:border-input dark:aria-[current=page]:bg-input/30 dark:aria-[current=page]:text-foreground"
        >
          {t.tabs[view]}
        </Link>
      ))}
    </nav>
  )
}
