"use client"

import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/app/components/ui/accordion"
import { useI18n } from "@/lib/i18n"

/**
 * Educational content about password security, Diceware method, and FAQs
 * Organized from most important/general topics to more advanced concepts
 */
export function LearnContent() {
  const { t } = useI18n()

  return (
    <div className="prose prose-sm dark:prose-invert max-w-none">
      <h2 className="text-2xl font-bold mb-4">{t.learn.title}</h2>

      <div className="space-y-6">
        {/* Getting Started: The Basics */}
        <section className="space-y-3">
          <h3 className="text-xl font-semibold">{t.learn.gettingStarted.title}</h3>
          <p className="text-muted-foreground leading-relaxed">
            {t.learn.gettingStarted.description}
          </p>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="rounded-lg border bg-muted/30 p-4 space-y-2">
              <p className="font-medium">{t.learn.gettingStarted.randomTitle}</p>
              <p className="text-sm text-muted-foreground">
                {t.learn.gettingStarted.randomDescription}
              </p>
              <p className="text-xs font-mono bg-background p-2 rounded">{t.learn.gettingStarted.randomExample}</p>
            </div>

            <div className="rounded-lg border bg-muted/30 p-4 space-y-2">
              <p className="font-medium">{t.learn.gettingStarted.dicewareTitle}</p>
              <p className="text-sm text-muted-foreground">
                {t.learn.gettingStarted.dicewareDescription}
              </p>
              <p className="text-xs font-mono bg-background p-2 rounded">
                {t.learn.gettingStarted.dicewareExample}
              </p>
            </div>
          </div>
        </section>

        {/* Why This Tool is Safe */}
        <section className="space-y-3">
          <h3 className="text-xl font-semibold">{t.learn.safety.title}</h3>
          <div className="rounded-lg border bg-green-500/10 border-green-500/20 p-4 space-y-2">
            <p className="text-sm leading-relaxed">{t.learn.safety.point1}</p>
            <p className="text-sm leading-relaxed">{t.learn.safety.point2}</p>
            <p className="text-sm leading-relaxed">{t.learn.safety.point3}</p>
            <p className="text-sm leading-relaxed">{t.learn.safety.point4}</p>
          </div>
        </section>

        {/* When to Use Each Method */}
        <section className="space-y-3">
          <h3 className="text-xl font-semibold">{t.learn.whenToUse.title}</h3>
          <div className="space-y-3">
            <div className="rounded-lg border bg-muted/30 p-4">
              <p className="font-medium mb-2">{t.learn.whenToUse.randomTitle}</p>
              <ul className="text-sm space-y-1 text-muted-foreground list-disc list-inside">
                {t.learn.whenToUse.randomList.map((item, index) => (
                  <li key={index}>{item}</li>
                ))}
              </ul>
            </div>
            
            <div className="rounded-lg border bg-muted/30 p-4">
              <p className="font-medium mb-2">{t.learn.whenToUse.dicewareTitle}</p>
              <ul className="text-sm space-y-1 text-muted-foreground list-disc list-inside">
                {t.learn.whenToUse.dicewareList.map((item, index) => (
                  <li key={index}>{item}</li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        {/* Understanding Strength */}
        <section className="space-y-3">
          <h3 className="text-xl font-semibold">{t.learn.strength.title}</h3>
          <p className="text-muted-foreground leading-relaxed">
            {t.learn.strength.description}
          </p>
          <div className="rounded-lg border bg-muted/30 p-4">
            <p className="text-sm font-medium mb-2">{t.learn.strength.guidelinesTitle}</p>
            <ul className="text-sm space-y-2 text-muted-foreground">
              <li>{t.learn.strength.weak}</li>
              <li>{t.learn.strength.strong}</li>
              <li>{t.learn.strength.veryStrong}</li>
            </ul>
            <p className="text-xs text-muted-foreground mt-3 italic">
              {t.learn.strength.example}
            </p>
          </div>
        </section>

        {/* Common Questions */}
        <section className="space-y-3">
          <h3 className="text-xl font-semibold">{t.learn.faq.title}</h3>

          <Accordion type="single" collapsible className="space-y-2">
            <AccordionItem value="faq-1" className="border rounded-lg px-4">
              <AccordionTrigger className="text-sm font-medium hover:no-underline">
                {t.learn.faq.q1}
              </AccordionTrigger>
              <AccordionContent className="text-sm text-muted-foreground space-y-2">
                {t.learn.faq.a1.map((paragraph, index) => (
                  <p key={index}>{paragraph}</p>
                ))}
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="faq-2" className="border rounded-lg px-4">
              <AccordionTrigger className="text-sm font-medium hover:no-underline">
                {t.learn.faq.q2}
              </AccordionTrigger>
              <AccordionContent className="text-sm text-muted-foreground space-y-2">
                <p className="font-medium">{t.learn.faq.a2Title}</p>
                <ol className="list-decimal list-inside space-y-1 ml-2">
                  {t.learn.faq.a2List.map((item, index) => (
                    <li key={index}>{item}</li>
                  ))}
                </ol>
                <p className="mt-2">{t.learn.faq.a2Footer}</p>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="faq-3" className="border rounded-lg px-4">
              <AccordionTrigger className="text-sm font-medium hover:no-underline">
                {t.learn.faq.q3}
              </AccordionTrigger>
              <AccordionContent className="text-sm text-muted-foreground space-y-2">
                {t.learn.faq.a3.map((paragraph, index) => (
                  <p key={index}>{paragraph}</p>
                ))}
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="faq-4" className="border rounded-lg px-4">
              <AccordionTrigger className="text-sm font-medium hover:no-underline">
                {t.learn.faq.q4}
              </AccordionTrigger>
              <AccordionContent className="text-sm text-muted-foreground space-y-2">
                {t.learn.faq.a4.map((paragraph, index) => (
                  <p key={index}>{paragraph}</p>
                ))}
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="faq-5" className="border rounded-lg px-4">
              <AccordionTrigger className="text-sm font-medium hover:no-underline">
                {t.learn.faq.q5}
              </AccordionTrigger>
              <AccordionContent className="text-sm text-muted-foreground">
                {t.learn.faq.a5}
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="faq-6" className="border rounded-lg px-4">
              <AccordionTrigger className="text-sm font-medium hover:no-underline">
                {t.learn.faq.q6}
              </AccordionTrigger>
              <AccordionContent className="text-sm text-muted-foreground">
                {t.learn.faq.a6}
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="faq-7" className="border rounded-lg px-4">
              <AccordionTrigger className="text-sm font-medium hover:no-underline">
                {t.learn.faq.q7}
              </AccordionTrigger>
              <AccordionContent className="text-sm text-muted-foreground space-y-2">
                <p className="font-medium">{t.learn.faq.a7GoodTitle}</p>
                <ul className="list-disc list-inside space-y-1 ml-2">
                  {t.learn.faq.a7GoodList.map((item, index) => (
                    <li key={index}>{item}</li>
                  ))}
                </ul>
                <p className="mt-2 font-medium">{t.learn.faq.a7BadTitle}</p>
                <ul className="list-disc list-inside space-y-1 ml-2">
                  {t.learn.faq.a7BadList.map((item, index) => (
                    <li key={index}>{item}</li>
                  ))}
                </ul>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="faq-8" className="border rounded-lg px-4">
              <AccordionTrigger className="text-sm font-medium hover:no-underline">
                {t.learn.faq.q8}
              </AccordionTrigger>
              <AccordionContent className="text-sm text-muted-foreground space-y-2">
                {t.learn.faq.a8.map((paragraph, index) => (
                  <p key={index}>{paragraph}</p>
                ))}
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="faq-9" className="border rounded-lg px-4">
              <AccordionTrigger className="text-sm font-medium hover:no-underline">
                {t.learn.faq.q9}
              </AccordionTrigger>
              <AccordionContent className="text-sm text-muted-foreground space-y-2">
                {t.learn.faq.a9.map((paragraph, index) => (
                  <p key={index}>{paragraph}</p>
                ))}
                <p className="font-medium">{t.learn.faq.a9Title}</p>
                <ul className="list-disc list-inside space-y-1 ml-2">
                  {t.learn.faq.a9List.map((item, index) => (
                    <li key={index}>{item}</li>
                  ))}
                </ul>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </section>

        {/* Method Comparison (Advanced) */}
        <section className="space-y-3">
          <h3 className="text-xl font-semibold">{t.learn.comparison.title}</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr className="border-b">
                  <th className="text-left p-2 font-medium">{t.learn.comparison.feature}</th>
                  <th className="text-left p-2 font-medium">{t.learn.comparison.randomPassword}</th>
                  <th className="text-left p-2 font-medium">{t.learn.comparison.dicewarePassphrase}</th>
                </tr>
              </thead>
              <tbody className="text-muted-foreground">
                <tr className="border-b">
                  <td className="p-2">{t.learn.comparison.memorability}</td>
                  <td className="p-2">{t.learn.comparison.memorabilityRandom}</td>
                  <td className="p-2">{t.learn.comparison.memorabilityDiceware}</td>
                </tr>
                <tr className="border-b">
                  <td className="p-2">{t.learn.comparison.typingSpeed}</td>
                  <td className="p-2">{t.learn.comparison.typingSpeedRandom}</td>
                  <td className="p-2">{t.learn.comparison.typingSpeedDiceware}</td>
                </tr>
                <tr className="border-b">
                  <td className="p-2">{t.learn.comparison.length}</td>
                  <td className="p-2">{t.learn.comparison.lengthRandom}</td>
                  <td className="p-2">{t.learn.comparison.lengthDiceware}</td>
                </tr>
                <tr className="border-b">
                  <td className="p-2">{t.learn.comparison.entropyPerChar}</td>
                  <td className="p-2">{t.learn.comparison.entropyRandom}</td>
                  <td className="p-2">{t.learn.comparison.entropyDiceware}</td>
                </tr>
                <tr className="border-b">
                  <td className="p-2">{t.learn.comparison.totalSecurity}</td>
                  <td className="p-2">{t.learn.comparison.securityRandom}</td>
                  <td className="p-2">{t.learn.comparison.securityDiceware}</td>
                </tr>
                <tr className="border-b">
                  <td className="p-2">{t.learn.comparison.bestFor}</td>
                  <td className="p-2">{t.learn.comparison.bestForRandom}</td>
                  <td className="p-2">{t.learn.comparison.bestForDiceware}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        {/* Security Best Practices */}
        <section className="space-y-3">
          <h3 className="text-xl font-semibold">{t.learn.bestPractices.title}</h3>
          <div className="rounded-lg border bg-muted/30 p-4">
            <ul className="text-sm space-y-2 text-muted-foreground list-disc list-inside">
              {t.learn.bestPractices.list.map((item, index) => (
                <li key={index}>{item}</li>
              ))}
            </ul>
          </div>
        </section>

        {/* What is Diceware? (Advanced) */}
        <section className="space-y-3">
          <h3 className="text-xl font-semibold">{t.learn.whatIsDiceware.title}</h3>
          <p className="text-muted-foreground leading-relaxed">
            {t.learn.whatIsDiceware.description1}
          </p>
          <p className="text-muted-foreground leading-relaxed">
            {t.learn.whatIsDiceware.description2}
          </p>
          <div className="rounded-lg border bg-muted/30 p-4 space-y-2">
            <p className="text-sm font-medium">{t.learn.whatIsDiceware.wordlistsTitle}</p>
            <ul className="text-sm space-y-1 text-muted-foreground">
              <li>• {t.learn.whatIsDiceware.ukrainian}</li>
              <li>• {t.learn.whatIsDiceware.english}</li>
            </ul>
          </div>
        </section>

        {/* Similar Tools */}
        <section className="space-y-3">
          <h3 className="text-xl font-semibold">{t.learn.similarTools.title}</h3>
          <p className="text-sm text-muted-foreground">
            {t.learn.similarTools.description}
          </p>
          <div className="space-y-2">
            <a
              href="https://diceware.dmuth.org/"
              target="_blank"
              rel="noopener noreferrer"
              className="block rounded-lg border bg-muted/30 p-3 text-sm hover:bg-muted/50 transition-colors"
            >
              <p className="font-medium">{t.learn.similarTools.dmuth}</p>
              <p className="text-muted-foreground text-xs mt-1">
                {t.learn.similarTools.dmuthDescription}
              </p>
            </a>
            <a
              href="https://strongphrase.net/"
              target="_blank"
              rel="noopener noreferrer"
              className="block rounded-lg border bg-muted/30 p-3 text-sm hover:bg-muted/50 transition-colors"
            >
              <p className="font-medium">{t.learn.similarTools.strongphrase}</p>
              <p className="text-muted-foreground text-xs mt-1">
                {t.learn.similarTools.strongphraseDescription}
              </p>
            </a>
          </div>
        </section>

        {/* Additional Resources */}
        <section className="space-y-3">
          <h3 className="text-xl font-semibold">{t.learn.resources.title}</h3>
          <p className="text-sm text-muted-foreground">
            {t.learn.resources.description}
          </p>
          <div className="space-y-2">
            <a
              href="https://www.eff.org/dice"
              target="_blank"
              rel="noopener noreferrer"
              className="block rounded-lg border bg-muted/30 p-3 text-sm hover:bg-muted/50 transition-colors"
            >
              <p className="font-medium">{t.learn.resources.eff}</p>
              <p className="text-muted-foreground text-xs mt-1">
                {t.learn.resources.effDescription}
              </p>
            </a>
            <a
              href="https://theworld.com/~reinhold/diceware.html"
              target="_blank"
              rel="noopener noreferrer"
              className="block rounded-lg border bg-muted/30 p-3 text-sm hover:bg-muted/50 transition-colors"
            >
              <p className="font-medium">{t.learn.resources.original}</p>
              <p className="text-muted-foreground text-xs mt-1">
                {t.learn.resources.originalDescription}
              </p>
            </a>
            <a
              href="https://xkcd.com/936/"
              target="_blank"
              rel="noopener noreferrer"
              className="block rounded-lg border bg-muted/30 p-3 text-sm hover:bg-muted/50 transition-colors"
            >
              <p className="font-medium">{t.learn.resources.xkcd}</p>
              <p className="text-muted-foreground text-xs mt-1">
                {t.learn.resources.xkcdDescription}
              </p>
            </a>
            <a
              href="https://pages.nist.gov/800-63-3/sp800-63b.html"
              target="_blank"
              rel="noopener noreferrer"
              className="block rounded-lg border bg-muted/30 p-3 text-sm hover:bg-muted/50 transition-colors"
            >
              <p className="font-medium">{t.learn.resources.nist}</p>
              <p className="text-muted-foreground text-xs mt-1">
                {t.learn.resources.nistDescription}
              </p>
            </a>
          </div>
        </section>
      </div>
    </div>
  )
}

