/**
 * Ukrainian charity donation section with trusted organizations and personal fundraising
 */
export function DonationSection() {
  return (
    <div className="space-y-4">
      <h3 className="text-center text-sm font-semibold text-foreground">Support Ukraine 🇺🇦</h3>
      <p className="text-center text-xs text-muted-foreground max-w-2xl mx-auto">
        Consider supporting Ukrainian defense and humanitarian efforts through these trusted organizations:
      </p>
      
      {/* Main charity organizations */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 max-w-4xl mx-auto">
        <a
          href="https://savelife.in.ua/en/"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center rounded-lg border bg-card hover:bg-accent transition-colors p-4 h-20"
          aria-label="Come Back Alive Foundation"
        >
          <img 
            src="/charity/comebackalive.svg" 
            alt="Come Back Alive" 
            className="max-h-12 w-auto dark:hidden"
          />
          <img 
            src="/charity/comebackalive-dark.svg" 
            alt="Come Back Alive" 
            className="max-h-12 w-auto hidden dark:block"
          />
        </a>
        <a
          href="https://prytulafoundation.org/en"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center rounded-lg border bg-card hover:bg-accent transition-colors p-4 h-20"
          aria-label="Serhiy Prytula Charity Foundation"
        >
          <img
            src="/charity/prytulafoundation.svg"
            alt="Serhiy Prytula Foundation"
            className="max-h-12 w-auto dark:hidden"
          />
          <img
            src="/charity/prytulafoundation-dark.svg"
            alt="Serhiy Prytula Foundation"
            className="max-h-12 w-auto hidden dark:block"
          />
        </a>
        <a
          href="https://u24.gov.ua/"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center rounded-lg border bg-card hover:bg-accent transition-colors p-4 h-20"
          aria-label="United24 - Official fundraising platform"
        >
          <img 
            src="/charity/united24.svg" 
            alt="United24" 
            className="max-h-12 w-auto dark:hidden"
          />
          <img 
            src="/charity/united24-dark.svg" 
            alt="United24" 
            className="max-h-12 w-auto hidden dark:block"
          />
        </a>
        <a
          href="https://www.sternenkofund.org/en"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center rounded-lg border bg-card hover:bg-accent transition-colors p-4 h-20"
          aria-label="Sternenko Community Foundation"
        >
          <img 
            src="/charity/sternenkofund.svg" 
            alt="Sternenko Fund" 
            className="max-h-12 w-auto dark:hidden"
          />
          <img 
            src="/charity/sternenkofund-dark.svg" 
            alt="Sternenko Fund" 
            className="max-h-12 w-auto hidden dark:block"
          />
        </a>
      </div>

      {/* Personal fundraising */}
      <div className="flex flex-col items-center gap-3 pt-2">
        <p className="text-xs text-muted-foreground">Or support our current fundraising:</p>
        <a
          href={process.env.NEXT_PUBLIC_MONOBANK_JAR_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center rounded-lg border bg-card hover:bg-accent transition-colors px-6 py-3 max-w-xs"
          aria-label="Personal charity account via Monobank"
        >
          <img
            src="/charity/monobank.svg"
            alt="Monobank Charity Jar"
            className="h-8 w-auto dark:hidden"
          />
          <img
            src="/charity/monobank-dark.svg"
            alt="Monobank Charity Jar"
            className="h-8 w-auto hidden dark:block"
          />
        </a>
      </div>
    </div>
  )
}

