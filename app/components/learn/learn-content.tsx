import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/app/components/ui/accordion"

/**
 * Educational content about password security, Diceware method, and FAQs
 * Organized from most important/general topics to more advanced concepts
 */
export function LearnContent() {
  return (
    <div className="prose prose-sm dark:prose-invert max-w-none">
      <h2 className="text-2xl font-bold mb-4">Password Security Guide</h2>

      <div className="space-y-6">
        {/* Getting Started: The Basics */}
        <section className="space-y-3">
          <h3 className="text-xl font-semibold">Getting Started</h3>
          <p className="text-muted-foreground leading-relaxed">
            Strong passwords protect your digital life. This tool helps you create two types of secure passwords:
          </p>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="rounded-lg border bg-muted/30 p-4 space-y-2">
              <p className="font-medium">🔐 Random Passwords</p>
              <p className="text-sm text-muted-foreground">
                Mix of letters, numbers, and symbols. Very secure but harder to remember. Perfect for password managers.
              </p>
              <p className="text-xs font-mono bg-background p-2 rounded">K9#mP2@xL5qR</p>
            </div>

            <div className="rounded-lg border bg-muted/30 p-4 space-y-2">
              <p className="font-medium">💬 Diceware Passphrases</p>
              <p className="text-sm text-muted-foreground">
                Random words combined together. Easy to remember and type while staying secure. Great for master passwords.
              </p>
              <p className="text-xs font-mono bg-background p-2 rounded">
                correct-horse-battery-staple
              </p>
            </div>
          </div>
        </section>

        {/* Why This Tool is Safe */}
        <section className="space-y-3">
          <h3 className="text-xl font-semibold">Why This Tool is Safe</h3>
          <div className="rounded-lg border bg-green-500/10 border-green-500/20 p-4 space-y-2">
            <p className="text-sm leading-relaxed">
              <span className="font-medium">✓ Everything happens in your browser.</span> No passwords are sent over the internet.
            </p>
            <p className="text-sm leading-relaxed">
              <span className="font-medium">✓ Nothing is stored.</span> Passwords are never saved anywhere unless you copy them.
            </p>
            <p className="text-sm leading-relaxed">
              <span className="font-medium">✓ Cryptographically secure.</span> Uses your browser&apos;s built-in secure random number generator.
            </p>
            <p className="text-sm leading-relaxed">
              <span className="font-medium">✓ Open source.</span> Anyone can review the code on GitHub.
            </p>
          </div>
        </section>

        {/* When to Use Each Method */}
        <section className="space-y-3">
          <h3 className="text-xl font-semibold">When to Use Each Method</h3>
          <div className="space-y-3">
            <div className="rounded-lg border bg-muted/30 p-4">
              <p className="font-medium mb-2">Use Random Passwords For:</p>
              <ul className="text-sm space-y-1 text-muted-foreground list-disc list-inside">
                <li>Accounts stored in a password manager</li>
                <li>Maximum security in minimum space</li>
                <li>Websites with character requirements</li>
              </ul>
            </div>
            
            <div className="rounded-lg border bg-muted/30 p-4">
              <p className="font-medium mb-2">Use Diceware Passphrases For:</p>
              <ul className="text-sm space-y-1 text-muted-foreground list-disc list-inside">
                <li>Master password for your password manager</li>
                <li>Disk encryption passwords</li>
                <li>Wi-Fi passwords you need to share or type often</li>
                <li>Any password you need to remember and type manually</li>
              </ul>
            </div>
          </div>
        </section>

        {/* Understanding Strength */}
        <section className="space-y-3">
          <h3 className="text-xl font-semibold">Understanding Password Strength</h3>
          <p className="text-muted-foreground leading-relaxed">
            Password strength is measured in <span className="font-medium">entropy bits</span>. Each additional bit doubles the number of possible combinations, making passwords exponentially harder to crack.
          </p>
          <div className="rounded-lg border bg-muted/30 p-4">
            <p className="text-sm font-medium mb-2">Strength Guidelines:</p>
            <ul className="text-sm space-y-2 text-muted-foreground">
              <li>🔴 <span className="font-medium">&lt;60 bits:</span> Weak — Avoid for important accounts</li>
              <li>🟡 <span className="font-medium">60-79 bits:</span> Strong — Good for most uses</li>
              <li>🟢 <span className="font-medium">80+ bits:</span> Very Strong — Excellent for sensitive data</li>
            </ul>
            <p className="text-xs text-muted-foreground mt-3 italic">
              Example: A 6-word Diceware passphrase has ~77 bits of entropy, which would take trillions of years to crack with current technology.
            </p>
          </div>
        </section>

        {/* Common Questions */}
        <section className="space-y-3">
          <h3 className="text-xl font-semibold">Common Questions</h3>

          <Accordion type="single" collapsible className="space-y-2">
            <AccordionItem value="faq-1" className="border rounded-lg px-4">
              <AccordionTrigger className="text-sm font-medium hover:no-underline">
                How many words should my passphrase have?
              </AccordionTrigger>
              <AccordionContent className="text-sm text-muted-foreground space-y-2">
                <p>
                  <span className="font-medium">6 words</span> is the sweet spot for most users — it provides strong security (~77 bits) while being reasonably easy to remember.
                </p>
                <p>
                  Use <span className="font-medium">7-8 words</span> for master passwords protecting sensitive information like password managers or encryption keys.
                </p>
                <p>
                  Avoid using fewer than 5 words, as this significantly reduces security.
                </p>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="faq-2" className="border rounded-lg px-4">
              <AccordionTrigger className="text-sm font-medium hover:no-underline">
                What&apos;s a good password strategy?
              </AccordionTrigger>
              <AccordionContent className="text-sm text-muted-foreground space-y-2">
                <p className="font-medium">The best approach:</p>
                <ol className="list-decimal list-inside space-y-1 ml-2">
                  <li>Use a password manager (like Bitwarden, 1Password, or ProtonPass)</li>
                  <li>Create one strong Diceware passphrase (6-7 words) as your master password</li>
                  <li>Generate random passwords for all other accounts</li>
                  <li>Enable two-factor authentication (2FA) wherever possible</li>
                </ol>
                <p className="mt-2">
                  This way, you only memorize one password while having unique, strong passwords everywhere.
                </p>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="faq-3" className="border rounded-lg px-4">
              <AccordionTrigger className="text-sm font-medium hover:no-underline">
                Why use Ukrainian wordlists?
              </AccordionTrigger>
              <AccordionContent className="text-sm text-muted-foreground space-y-2">
                <p>
                  Passphrases in your native language are easier to remember and feel more natural. Passphrase UA is the first tool to offer comprehensive Ukrainian Diceware wordlists.
                </p>
                <p>
                  The <span className="font-medium">transliteration feature</span> lets you type Ukrainian words using a standard Latin keyboard (e.g., "собака" becomes "sobaka"), making it easier to enter on any device while maintaining Ukrainian vocabulary.
                </p>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="faq-4" className="border rounded-lg px-4">
              <AccordionTrigger className="text-sm font-medium hover:no-underline">
                Should I exclude ambiguous characters in passwords?
              </AccordionTrigger>
              <AccordionContent className="text-sm text-muted-foreground space-y-2">
                <p>
                  If you frequently type your password manually, excluding ambiguous characters (like &apos;O&apos; vs &apos;0&apos;, &apos;l&apos; vs &apos;1&apos;) reduces typing errors. This slightly decreases entropy but improves usability.
                </p>
                <p>
                  For passwords stored in a password manager that you&apos;ll copy-paste, keep all characters for maximum strength.
                </p>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="faq-5" className="border rounded-lg px-4">
              <AccordionTrigger className="text-sm font-medium hover:no-underline">
                Can I use this tool offline?
              </AccordionTrigger>
              <AccordionContent className="text-sm text-muted-foreground">
                Yes! After the page loads once, you can use it without an internet connection. All generation happens locally in your browser, and wordlists are cached for offline use.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="faq-6" className="border rounded-lg px-4">
              <AccordionTrigger className="text-sm font-medium hover:no-underline">
                How is &quot;time to crack&quot; calculated?
              </AccordionTrigger>
              <AccordionContent className="text-sm text-muted-foreground">
                We calculate the average time an attacker would need to guess your password by trying combinations. The calculation assumes a powerful adversary with 1 trillion guesses per second (using specialized hardware). Real-world attacks are usually much slower due to rate limiting and other protections.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="faq-7" className="border rounded-lg px-4">
              <AccordionTrigger className="text-sm font-medium hover:no-underline">
                What are good use cases for Diceware passphrases?
              </AccordionTrigger>
              <AccordionContent className="text-sm text-muted-foreground space-y-2">
                <p className="font-medium">Excellent use cases:</p>
                <ul className="list-disc list-inside space-y-1 ml-2">
                  <li>Master password for password managers</li>
                  <li>Smart TVs and devices where typing symbols is difficult</li>
                  <li>Wi-Fi passwords that you need to share with guests</li>
                  <li>Shared computers where you can&apos;t install password managers</li>
                  <li>Full-disk encryption passwords</li>
                  <li>Any password you need to type frequently by hand</li>
                </ul>
                <p className="mt-2 font-medium">Not recommended for:</p>
                <ul className="list-disc list-inside space-y-1 ml-2">
                  <li>Cryptocurrency wallets (use hardware wallets with seed phrases instead)</li>
                  <li>Situations where an attacker can make unlimited offline cracking attempts</li>
                </ul>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="faq-8" className="border rounded-lg px-4">
              <AccordionTrigger className="text-sm font-medium hover:no-underline">
                Should I add numbers or symbols to my passphrase?
              </AccordionTrigger>
              <AccordionContent className="text-sm text-muted-foreground space-y-2">
                <p>
                  Generally, <span className="font-medium">no</span> — length is more important than complexity. Adding a single number or symbol only adds a few bits of entropy, while adding another word adds ~13 bits.
                </p>
                <p>
                  For example: <span className="font-mono text-xs">correct-horse-battery-staple-7</span> is barely stronger than <span className="font-mono text-xs">correct-horse-battery-staple</span>, but <span className="font-mono text-xs">correct-horse-battery-staple-magnet</span> is significantly stronger.
                </p>
                <p>
                  Only add special characters if a website requires them — otherwise, keep it simple and memorable.
                </p>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="faq-9" className="border rounded-lg px-4">
              <AccordionTrigger className="text-sm font-medium hover:no-underline">
                Will a strong password protect me from phishing?
              </AccordionTrigger>
              <AccordionContent className="text-sm text-muted-foreground space-y-2">
                <p>
                  Unfortunately, no. Even the strongest password in the world won&apos;t help if you enter it on a fake website. However, using unique passwords for each service means that if one gets phished, your other accounts remain safe.
                </p>
                <p className="font-medium">Protect yourself from phishing:</p>
                <ul className="list-disc list-inside space-y-1 ml-2">
                  <li>Always check the website URL before entering passwords</li>
                  <li>Enable two-factor authentication (2FA) on all accounts</li>
                  <li>Use a password manager — they won&apos;t autofill on fake sites</li>
                  <li>Be suspicious of urgent emails asking you to log in</li>
                </ul>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </section>

        {/* Method Comparison (Advanced) */}
        <section className="space-y-3">
          <h3 className="text-xl font-semibold">Detailed Method Comparison</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr className="border-b">
                  <th className="text-left p-2 font-medium">Feature</th>
                  <th className="text-left p-2 font-medium">Random Password</th>
                  <th className="text-left p-2 font-medium">Diceware Passphrase</th>
                </tr>
              </thead>
              <tbody className="text-muted-foreground">
                <tr className="border-b">
                  <td className="p-2">Memorability</td>
                  <td className="p-2">Very Difficult</td>
                  <td className="p-2">Easy</td>
                </tr>
                <tr className="border-b">
                  <td className="p-2">Typing Speed</td>
                  <td className="p-2">Slow (symbols, case)</td>
                  <td className="p-2">Fast (just words)</td>
                </tr>
                <tr className="border-b">
                  <td className="p-2">Typical Length</td>
                  <td className="p-2">12-20 characters</td>
                  <td className="p-2">30-50 characters</td>
                </tr>
                <tr className="border-b">
                  <td className="p-2">Entropy per Character</td>
                  <td className="p-2">High (~6.5 bits)</td>
                  <td className="p-2">Lower (~2.6 bits)</td>
                </tr>
                <tr className="border-b">
                  <td className="p-2">Total Security (similar)</td>
                  <td className="p-2">16 chars ≈ 104 bits</td>
                  <td className="p-2">6 words ≈ 77 bits</td>
                </tr>
                <tr className="border-b">
                  <td className="p-2">Best For</td>
                  <td className="p-2">Password managers</td>
                  <td className="p-2">Master passwords</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        {/* Security Best Practices */}
        <section className="space-y-3">
          <h3 className="text-xl font-semibold">Security Best Practices</h3>
          <div className="rounded-lg border bg-muted/30 p-4">
            <ul className="text-sm space-y-2 text-muted-foreground list-disc list-inside">
              <li>Use unique passwords for every account — never reuse</li>
              <li>Use a password manager to securely store all your passwords</li>
              <li>Enable two-factor authentication (2FA) on all important accounts</li>
              <li>Update passwords if there&apos;s a security breach</li>
              <li>Never share passwords via email, text, or messaging apps</li>
              <li>Don&apos;t use personal information (birthdays, names, pet names)</li>
              <li>Be suspicious of phishing attempts asking for passwords</li>
            </ul>
          </div>
        </section>

        {/* What is Diceware? (Advanced) */}
        <section className="space-y-3">
          <h3 className="text-xl font-semibold">What is Diceware?</h3>
          <p className="text-muted-foreground leading-relaxed">
            Diceware is a method created by Arnold G. Reinhold in 1995 for generating secure, memorable passphrases. Originally, you would roll physical dice to randomly select words from a list.
          </p>
          <p className="text-muted-foreground leading-relaxed">
            This tool uses the same principle but with a cryptographically secure random number generator instead of dice. The wordlists are carefully curated to include only memorable, appropriate words while maintaining maximum security.
          </p>
          <div className="rounded-lg border bg-muted/30 p-4 space-y-2">
            <p className="text-sm font-medium">Available Wordlists:</p>
            <ul className="text-sm space-y-1 text-muted-foreground">
              <li>• <span className="font-medium">Ukrainian:</span> First comprehensive Ukrainian Diceware wordlists (small, normal, large) with transliteration</li>
              <li>• <span className="font-medium">English:</span> EFF and Original Diceware wordlists — time-tested and widely trusted</li>
            </ul>
          </div>
        </section>

        {/* Similar Tools */}
        <section className="space-y-3">
          <h3 className="text-xl font-semibold">Similar Tools</h3>
          <p className="text-sm text-muted-foreground">
            Other excellent password generators you might find useful:
          </p>
          <div className="space-y-2">
            <a
              href="https://diceware.dmuth.org/"
              target="_blank"
              rel="noopener noreferrer"
              className="block rounded-lg border bg-muted/30 p-3 text-sm hover:bg-muted/50 transition-colors"
            >
              <p className="font-medium">Diceware Password Generator by Doug Muth</p>
              <p className="text-muted-foreground text-xs mt-1">
                Interactive Diceware generator with dice animation and EFF wordlist. Great for visualizing the randomness process.
              </p>
            </a>
            <a
              href="https://strongphrase.net/"
              target="_blank"
              rel="noopener noreferrer"
              className="block rounded-lg border bg-muted/30 p-3 text-sm hover:bg-muted/50 transition-colors"
            >
              <p className="font-medium">StrongPhrase</p>
              <p className="text-muted-foreground text-xs mt-1">
                Advanced passphrase generator with detailed password strength analysis and cracking cost estimates. Excellent for understanding security metrics.
              </p>
            </a>
          </div>
        </section>

        {/* Additional Resources */}
        <section className="space-y-3">
          <h3 className="text-xl font-semibold">Educational Resources</h3>
          <p className="text-sm text-muted-foreground">
            Learn more about password security and the Diceware method:
          </p>
          <div className="space-y-2">
            <a
              href="https://www.eff.org/dice"
              target="_blank"
              rel="noopener noreferrer"
              className="block rounded-lg border bg-muted/30 p-3 text-sm hover:bg-muted/50 transition-colors"
            >
              <p className="font-medium">EFF&apos;s Dice-Generated Passphrases</p>
              <p className="text-muted-foreground text-xs mt-1">
                Comprehensive guide to the Diceware method with official EFF wordlists
              </p>
            </a>
            <a
              href="https://theworld.com/~reinhold/diceware.html"
              target="_blank"
              rel="noopener noreferrer"
              className="block rounded-lg border bg-muted/30 p-3 text-sm hover:bg-muted/50 transition-colors"
            >
              <p className="font-medium">Original Diceware by Arnold G. Reinhold</p>
              <p className="text-muted-foreground text-xs mt-1">
                The original Diceware page from 1995 — the method that started it all
              </p>
            </a>
            <a
              href="https://xkcd.com/936/"
              target="_blank"
              rel="noopener noreferrer"
              className="block rounded-lg border bg-muted/30 p-3 text-sm hover:bg-muted/50 transition-colors"
            >
              <p className="font-medium">XKCD: Password Strength</p>
              <p className="text-muted-foreground text-xs mt-1">
                Famous comic explaining why &quot;correct horse battery staple&quot; is more secure and memorable than &quot;Tr0ub4dor&amp;3&quot;
              </p>
            </a>
            <a
              href="https://pages.nist.gov/800-63-3/sp800-63b.html"
              target="_blank"
              rel="noopener noreferrer"
              className="block rounded-lg border bg-muted/30 p-3 text-sm hover:bg-muted/50 transition-colors"
            >
              <p className="font-medium">NIST Digital Identity Guidelines</p>
              <p className="text-muted-foreground text-xs mt-1">
                Official U.S. government guidelines on authentication and password security
              </p>
            </a>
          </div>
        </section>
      </div>
    </div>
  )
}

