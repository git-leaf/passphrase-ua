"use client"

import Image from "next/image"
import { useI18n, type DonationId } from "@/lib/i18n"
import { cn } from "@/lib/utils"

interface DonationLink {
  /** Also the logo file name in /public/charity, without the -dark suffix or extension */
  id: DonationId
  href: string
  width: number
  height: number
}

const organizations: DonationLink[] = [
  { id: "comebackalive", href: "https://savelife.in.ua/en/", width: 62, height: 31 },
  { id: "prytulafoundation", href: "https://prytulafoundation.org/en", width: 261, height: 48 },
  { id: "united24", href: "https://u24.gov.ua/", width: 422, height: 40 },
  { id: "sternenkofund", href: "https://www.sternenkofund.org/en", width: 506, height: 200 },
]

/** Left out when unset, as in forks, so the footer never shows a link that goes nowhere */
const personalJarUrl = process.env.NEXT_PUBLIC_MONOBANK_JAR_URL

/**
 * Ukrainian charity donation section with trusted organizations and personal fundraising
 */
export function DonationSection() {
  const { t } = useI18n()

  return (
    <div className="space-y-4">
      <h2 className="text-center text-sm font-semibold text-foreground">{t.footer.supportUkraine}</h2>
      <p className="text-center text-xs text-muted-foreground max-w-2xl mx-auto">{t.footer.supportDescription}</p>

      {/* Main charity organizations */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 max-w-4xl mx-auto">
        {organizations.map((organization) => (
          <DonationLogoLink
            key={organization.id}
            link={organization}
            className="p-4 h-20"
            logoClassName="max-h-12 w-auto"
          />
        ))}
      </div>

      {/* Personal fundraising */}
      {personalJarUrl && (
        <div className="flex flex-col items-center gap-3 pt-2">
          <p className="text-xs text-muted-foreground">{t.footer.supportFundraising}</p>
          <DonationLogoLink
            link={{ id: "monobank", href: personalJarUrl, width: 109, height: 24 }}
            className="px-6 py-3 max-w-xs"
            logoClassName="h-8 w-auto"
          />
        </div>
      )}
    </div>
  )
}

/**
 * External donation link showing the light or dark logo variant to match the theme
 */
function DonationLogoLink({
  link,
  className,
  logoClassName,
}: {
  link: DonationLink
  className: string
  logoClassName: string
}) {
  const { t } = useI18n()
  const name = t.footer.donations[link.id]

  return (
    <a
      href={link.href}
      target="_blank"
      rel="noopener noreferrer"
      className={cn(
        "flex items-center justify-center rounded-lg border bg-card hover:bg-accent transition-colors",
        className,
      )}
      aria-label={name}
    >
      <Image
        src={`/charity/${link.id}.svg`}
        alt={name}
        width={link.width}
        height={link.height}
        className={cn(logoClassName, "dark:hidden")}
      />
      <Image
        src={`/charity/${link.id}-dark.svg`}
        alt={name}
        width={link.width}
        height={link.height}
        className={cn(logoClassName, "hidden dark:block")}
      />
    </a>
  )
}
