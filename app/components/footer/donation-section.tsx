"use client"

import Image from "next/image"
import { useI18n } from "@/lib/i18n"
import { cn } from "@/lib/utils"

interface DonationLink {
  href: string | undefined
  ariaLabel: string
  logoAlt: string
  /** Logo file name in /public/charity, without the -dark suffix or extension */
  logo: string
  width: number
  height: number
}

const organizations: DonationLink[] = [
  {
    href: "https://savelife.in.ua/en/",
    ariaLabel: "Come Back Alive Foundation",
    logoAlt: "Come Back Alive",
    logo: "comebackalive",
    width: 62,
    height: 31,
  },
  {
    href: "https://prytulafoundation.org/en",
    ariaLabel: "Serhiy Prytula Charity Foundation",
    logoAlt: "Serhiy Prytula Foundation",
    logo: "prytulafoundation",
    width: 261,
    height: 48,
  },
  {
    href: "https://u24.gov.ua/",
    ariaLabel: "United24 - Official fundraising platform",
    logoAlt: "United24",
    logo: "united24",
    width: 422,
    height: 40,
  },
  {
    href: "https://www.sternenkofund.org/en",
    ariaLabel: "Sternenko Community Foundation",
    logoAlt: "Sternenko Fund",
    logo: "sternenkofund",
    width: 506,
    height: 200,
  },
]

const personalJar: DonationLink = {
  href: process.env.NEXT_PUBLIC_MONOBANK_JAR_URL,
  ariaLabel: "Personal charity account via Monobank",
  logoAlt: "Monobank Charity Jar",
  logo: "monobank",
  width: 109,
  height: 24,
}

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
            key={organization.logo}
            link={organization}
            className="p-4 h-20"
            logoClassName="max-h-12 w-auto"
          />
        ))}
      </div>

      {/* Personal fundraising */}
      <div className="flex flex-col items-center gap-3 pt-2">
        <p className="text-xs text-muted-foreground">{t.footer.supportFundraising}</p>
        <DonationLogoLink link={personalJar} className="px-6 py-3 max-w-xs" logoClassName="h-8 w-auto" />
      </div>
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
  return (
    <a
      href={link.href}
      target="_blank"
      rel="noopener noreferrer"
      className={cn(
        "flex items-center justify-center rounded-lg border bg-card hover:bg-accent transition-colors",
        className,
      )}
      aria-label={link.ariaLabel}
    >
      <Image
        src={`/charity/${link.logo}.svg`}
        alt={link.logoAlt}
        width={link.width}
        height={link.height}
        className={cn(logoClassName, "dark:hidden")}
      />
      <Image
        src={`/charity/${link.logo}-dark.svg`}
        alt={link.logoAlt}
        width={link.width}
        height={link.height}
        className={cn(logoClassName, "hidden dark:block")}
      />
    </a>
  )
}
