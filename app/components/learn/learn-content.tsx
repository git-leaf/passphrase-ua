import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/app/components/ui/accordion"

/**
 * Educational content about password security, Diceware method, and FAQs
 */
export function LearnContent() {
  return (
    <div className="prose prose-sm dark:prose-invert max-w-none">
      <h2 className="text-2xl font-bold mb-4">Understanding Password Security</h2>

      <div className="space-y-6">
        {/* What is Entropy? */}
        <section className="space-y-3">
          <h3 className="text-xl font-semibold">What is Entropy?</h3>
          <p className="text-muted-foreground leading-relaxed">
            Entropy measures the randomness and unpredictability of your password. It&apos;s measured in bits -
            each additional bit doubles the number of possible combinations. For example, 40 bits = 1
            trillion combinations, while 80 bits = 1.2 quintillion combinations.
          </p>
          <div className="rounded-lg border bg-muted/30 p-4">
            <p className="text-sm font-medium mb-2">Entropy Levels:</p>
            <ul className="text-sm space-y-1 text-muted-foreground">
              <li>• &lt;40 bits: Weak - Can be cracked quickly</li>
              <li>• 40-60 bits: Fair - Resistant to basic attacks</li>
              <li>• 60-80 bits: Strong - Secure for most uses</li>
              <li>• 80+ bits: Very Strong - Highly secure</li>
            </ul>
          </div>
        </section>

        {/* Random Password vs Diceware */}
        <section className="space-y-3">
          <h3 className="text-xl font-semibold">Random Password vs Diceware Passphrase</h3>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="rounded-lg border bg-muted/30 p-4 space-y-2">
              <p className="font-medium">Random Password</p>
              <p className="text-sm text-muted-foreground">
                Uses random characters from various character sets (uppercase, lowercase, numbers, symbols).
                Provides high entropy in short length but can be difficult to remember and type.
              </p>
              <p className="text-xs font-mono bg-background p-2 rounded">Example: K9#mP2@xL5qR</p>
            </div>

            <div className="rounded-lg border bg-muted/30 p-4 space-y-2">
              <p className="font-medium">Diceware Passphrase</p>
              <p className="text-sm text-muted-foreground">
                Uses random words from a standardized wordlist. Easier to remember and type while
                maintaining strong security through length. Based on the Diceware method created by Arnold
                Reinhold.
              </p>
              <p className="text-xs font-mono bg-background p-2 rounded">
                Example: correct-horse-battery-staple
              </p>
            </div>
          </div>
        </section>

        {/* Comparison Table */}
        <section className="space-y-3">
          <h3 className="text-xl font-semibold">Method Comparison</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr className="border-b">
                  <th className="text-left p-2 font-medium">Criteria</th>
                  <th className="text-left p-2 font-medium">Random Password</th>
                  <th className="text-left p-2 font-medium">Diceware Passphrase</th>
                </tr>
              </thead>
              <tbody className="text-muted-foreground">
                <tr className="border-b">
                  <td className="p-2">Memorability</td>
                  <td className="p-2">Difficult</td>
                  <td className="p-2">Easy</td>
                </tr>
                <tr className="border-b">
                  <td className="p-2">Typing Speed</td>
                  <td className="p-2">Slow</td>
                  <td className="p-2">Fast</td>
                </tr>
                <tr className="border-b">
                  <td className="p-2">Length</td>
                  <td className="p-2">Short (12-16 chars)</td>
                  <td className="p-2">Long (25-50 chars)</td>
                </tr>
                <tr className="border-b">
                  <td className="p-2">Entropy per Character</td>
                  <td className="p-2">High (~6.5 bits)</td>
                  <td className="p-2">Moderate (~2.6 bits)</td>
                </tr>
                <tr className="border-b">
                  <td className="p-2">Best Use Case</td>
                  <td className="p-2">Password managers</td>
                  <td className="p-2">Master passwords</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="space-y-3">
          <h3 className="text-xl font-semibold">Frequently Asked Questions</h3>

          <Accordion type="single" collapsible className="space-y-2">
            <AccordionItem value="faq-1" className="border rounded-lg px-4">
              <AccordionTrigger className="text-sm font-medium hover:no-underline">
                How many words should I use in a passphrase?
              </AccordionTrigger>
              <AccordionContent className="text-sm text-muted-foreground">
                For most users, 6 words provide excellent security (approximately 77 bits of entropy with
                EFF&apos;s long wordlist). If you&apos;re protecting highly sensitive information, consider 7-8 words.
                Remember: more words = more security, but also harder to remember.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="faq-2" className="border rounded-lg px-4">
              <AccordionTrigger className="text-sm font-medium hover:no-underline">
                What is the EFF wordlist?
              </AccordionTrigger>
              <AccordionContent className="text-sm text-muted-foreground">
                The Electronic Frontier Foundation (EFF) created wordlists specifically designed for
                generating passphrases. The long list contains 7,776 words (6^5), each carefully chosen to
                be memorable, unambiguous, and appropriate. Each word adds approximately 12.9 bits of
                entropy.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="faq-3" className="border rounded-lg px-4">
              <AccordionTrigger className="text-sm font-medium hover:no-underline">
                Should I exclude ambiguous characters?
              </AccordionTrigger>
              <AccordionContent className="text-sm text-muted-foreground">
                If you need to manually type your password frequently, excluding ambiguous characters (like
                &apos;i&apos;, &apos;l&apos;, &apos;1&apos;, &apos;O&apos;, &apos;0&apos;) can reduce typing errors. However, this slightly reduces entropy.
                For passwords stored in a password manager, there&apos;s no need to exclude them.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="faq-4" className="border rounded-lg px-4">
              <AccordionTrigger className="text-sm font-medium hover:no-underline">
                Why use Ukrainian wordlists?
              </AccordionTrigger>
              <AccordionContent className="text-sm text-muted-foreground">
                Using your native language can make passphrases even more memorable. The transliteration
                feature allows you to type non-Latin characters using standard keyboard layouts. This is
                especially useful for Ukrainian users who want memorable passphrases in their native
                language.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="faq-5" className="border rounded-lg px-4">
              <AccordionTrigger className="text-sm font-medium hover:no-underline">
                How is the &quot;time to crack&quot; calculated?
              </AccordionTrigger>
              <AccordionContent className="text-sm text-muted-foreground">
                The calculation assumes an attacker tries half of all possible combinations on average
                (average case). We divide total combinations by 2, then by the guess rate. Default guess
                rate (1 trillion/sec) represents a powerful adversary with significant resources. Actual
                time may vary based on implementation details.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="faq-6" className="border rounded-lg px-4">
              <AccordionTrigger className="text-sm font-medium hover:no-underline">
                Is this tool safe to use?
              </AccordionTrigger>
              <AccordionContent className="text-sm text-muted-foreground">
                Yes! All password generation happens entirely in your browser using JavaScript&apos;s
                cryptographically secure random number generator (crypto.getRandomValues). Nothing is
                stored, logged, or transmitted to any server. You can even use this tool offline after
                loading the page.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="faq-7" className="border rounded-lg px-4">
              <AccordionTrigger className="text-sm font-medium hover:no-underline">
                What&apos;s a good password strategy?
              </AccordionTrigger>
              <AccordionContent className="text-sm text-muted-foreground">
                Use a password manager to store unique, random passwords for every account. Create one
                strong master passphrase (6-7 words) that you memorize for your password manager. This way,
                you only need to remember one password while maintaining unique, secure passwords
                everywhere.
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </section>

        {/* Best Practices */}
        <section className="space-y-3">
          <h3 className="text-xl font-semibold">Security Best Practices</h3>
          <div className="rounded-lg border bg-muted/30 p-4 space-y-2">
            <ul className="text-sm space-y-2 text-muted-foreground list-disc list-inside">
              <li>Never reuse passwords across different accounts</li>
              <li>Use a password manager to store and organize passwords</li>
              <li>Enable two-factor authentication (2FA) whenever possible</li>
              <li>Regularly update passwords for sensitive accounts (banking, email)</li>
              <li>Avoid using personal information (names, dates, etc.)</li>
              <li>Don&apos;t share passwords via email or messaging apps</li>
              <li>Use longer passphrases for master passwords you must remember</li>
              <li>Generate random passwords for accounts stored in password managers</li>
            </ul>
          </div>
        </section>

        {/* Resources */}
        <section className="space-y-3">
          <h3 className="text-xl font-semibold">Additional Resources</h3>
          <div className="space-y-2">
            <a
              href="https://www.eff.org/dice"
              target="_blank"
              rel="noopener noreferrer"
              className="block rounded-lg border bg-muted/30 p-3 text-sm hover:bg-muted/50 transition-colors"
            >
              <p className="font-medium">EFF Dice-Generated Passphrases</p>
              <p className="text-muted-foreground text-xs mt-1">
                Learn about the original Diceware method and wordlists
              </p>
            </a>
            <a
              href="https://www.nist.gov/publications/digital-identity-guidelines"
              target="_blank"
              rel="noopener noreferrer"
              className="block rounded-lg border bg-muted/30 p-3 text-sm hover:bg-muted/50 transition-colors"
            >
              <p className="font-medium">NIST Digital Identity Guidelines</p>
              <p className="text-muted-foreground text-xs mt-1">
                Official guidelines on password security and authentication
              </p>
            </a>
            <a
              href="https://pages.nist.gov/800-63-3/sp800-63b.html#appA"
              target="_blank"
              rel="noopener noreferrer"
              className="block rounded-lg border bg-muted/30 p-3 text-sm hover:bg-muted/50 transition-colors"
            >
              <p className="font-medium">Password Strength Estimation</p>
              <p className="text-muted-foreground text-xs mt-1">
                Technical details on measuring password strength
              </p>
            </a>
          </div>
        </section>
      </div>
    </div>
  )
}

