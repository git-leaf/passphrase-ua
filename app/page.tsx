"use client"

import { useState } from "react"
import { Button } from "@/app/components/ui/button"
import { Card, CardContent } from "@/app/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/app/components/ui/tabs"
import { Label } from "@/app/components/ui/label"
import { Slider } from "@/app/components/ui/slider"
import { Switch } from "@/app/components/ui/switch"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/app/components/ui/accordion"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/app/components/ui/select"
import { Input } from "@/app/components/ui/input"
import { Copy, RefreshCw, Shield, Github, Mail } from "lucide-react"
import { useToast } from "@/app/hooks/use-toast"
import { ThemeToggle } from "@/app/components/theme-toggle"
import { 
  generatePassword, 
  type PasswordConfig 
} from "@/lib/generators/password"
import {
  generatePassphraseWithDictionary,
  type CapitalizationStyle
} from "@/lib/generators/passphrase"
import { 
  assessStrength, 
  calculateTimeToCrack, 
  calculateCostToCrack,
  calculateCombinations,
  GUESS_RATES,
  COST_ESTIMATES
} from "@/lib/generators/entropy"
import { AVAILABLE_DICTIONARIES } from "@/lib/dictionaries/types"

export default function Home() {
  const { toast } = useToast()
  const [activeTab, setActiveTab] = useState("password")

  // Password options
  const [passwordLength, setPasswordLength] = useState([16])
  const [includeUppercase, setIncludeUppercase] = useState(true)
  const [includeLowercase, setIncludeLowercase] = useState(true)
  const [includeNumbers, setIncludeNumbers] = useState(true)
  const [includeSymbols, setIncludeSymbols] = useState(true)
  const [excludeAmbiguous, setExcludeAmbiguous] = useState(false)

  // Passphrase options
  const [wordCount, setWordCount] = useState([6])
  const [separator, setSeparator] = useState("-")
  const [customSeparator, setCustomSeparator] = useState("")
  const [capitalization, setCapitalization] = useState<CapitalizationStyle>("none")
  const [includeNumbers2, setIncludeNumbers2] = useState(false)
  const [sourceLanguage, setSourceLanguage] = useState<"en" | "uk">("uk")
  const [wordlist, setWordlist] = useState("wordlist")
  const [showTransliteration, setShowTransliteration] = useState(false)
  const [isGeneratingPassphrase, setIsGeneratingPassphrase] = useState(false)

  const [guessRate, setGuessRate] = useState("1e12") // 1 trillion guesses/sec
  const [customGuessRate, setCustomGuessRate] = useState("")
  const [costPer32, setCostPer32] = useState("0.01") // $0.01 per 2^32 guesses
  const [customCostPer32, setCustomCostPer32] = useState("")

  // Generated output
  const [generatedPassword, setGeneratedPassword] = useState("")
  const [entropy, setEntropy] = useState(0)

  const handleGeneratePassword = () => {
    try {
      // Build configuration from UI state
      const config: PasswordConfig = {
        length: passwordLength[0],
        includeLowercase,
        includeUppercase,
        includeNumbers,
        includeSymbols,
        excludeAmbiguous,
      }

      // Generate password using secure generator
      const result = generatePassword(config)

      // Update UI state
      setGeneratedPassword(result.password)
      setEntropy(result.entropy)
    } catch (error) {
      // Handle errors (e.g., invalid configuration)
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to generate password",
        variant: "destructive",
      })
    }
  }

  const handleGeneratePassphrase = async () => {
    setIsGeneratingPassphrase(true)
    
    try {
      // Determine separator
      const actualSeparator = separator === "custom" ? customSeparator : separator

      // Generate passphrase using the secure generator
      const result = await generatePassphraseWithDictionary(
        sourceLanguage,
        wordlist,
        {
          wordCount: wordCount[0],
          separator: actualSeparator,
          capitalization,
          includeNumber: includeNumbers2,
          useTransliteration: showTransliteration,
        }
      )

      // Update UI state
      setGeneratedPassword(result.passphrase)
      setEntropy(result.entropy)
    } catch (error) {
      // Handle errors (e.g., dictionary loading failure)
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to generate passphrase",
        variant: "destructive",
      })
    } finally {
      setIsGeneratingPassphrase(false)
    }
  }

  const getStrengthFromEntropy = (ent: number) => {
    const strength = assessStrength(ent)
    return { label: strength.label, color: strength.color }
  }

  const getGuessRateValue = () => {
    if (guessRate === "custom") {
      return Number.parseFloat(customGuessRate) || 1e12
    }
    return Number.parseFloat(guessRate)
  }

  const getCostPer32Value = () => {
    if (costPer32 === "custom") {
      return Number.parseFloat(customCostPer32) || 0.01
    }
    return Number.parseFloat(costPer32)
  }

  const getTimeToCrackFormatted = () => {
    const rate = getGuessRateValue()
    const result = calculateTimeToCrack(entropy, rate)
    return result.formatted
  }

  const getCostToCrackFormatted = () => {
    const costPer = getCostPer32Value()
    const result = calculateCostToCrack(entropy, costPer)
    return result.formatted
  }

  const getCombinationsFormatted = () => {
    return calculateCombinations(entropy)
  }

  const copyToClipboard = () => {
    if (!generatedPassword) return
    navigator.clipboard.writeText(generatedPassword)
    toast({
      title: "Copied!",
      description: "Password copied to clipboard",
    })
  }

  return (
    <main className="min-h-screen bg-background py-12 px-4">
      <div className="mx-auto max-w-3xl">
        {/* Header */}
        <div className="mb-8 text-center">
          <div className="mb-4 flex items-center justify-end">
            <ThemeToggle />
          </div>
          <div className="mb-2 flex items-center justify-center gap-2">
            <Shield className="h-8 w-8 text-primary" />
            <h1 className="text-4xl font-bold tracking-tight">Passphrase UA</h1>
          </div>
          <p className="text-muted-foreground">Generate secure passwords and memorable passphrases</p>
        </div>

        <Card className="border-2">
          <CardContent className="pt-6">
            {/* Method Selector */}
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="mb-6 grid w-full grid-cols-3 h-auto">
                <TabsTrigger value="password" className="text-sm sm:text-base whitespace-normal py-2">
                  Password
                </TabsTrigger>
                <TabsTrigger value="passphrase" className="text-sm sm:text-base whitespace-normal py-2">
                  Passphrase
                </TabsTrigger>
                <TabsTrigger value="learn" className="text-sm sm:text-base whitespace-normal py-2">
                  Learn
                </TabsTrigger>
              </TabsList>

              {/* Password Configuration */}
              <TabsContent value="password" className="space-y-6">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label>Password Length</Label>
                      <span className="text-sm font-medium">{passwordLength[0]}</span>
                    </div>
                    <Slider
                      value={passwordLength}
                      onValueChange={setPasswordLength}
                      min={8}
                      max={64}
                      step={1}
                      className="w-full"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="flex items-center justify-between space-x-2">
                      <Label htmlFor="uppercase">Uppercase (A-Z)</Label>
                      <Switch id="uppercase" checked={includeUppercase} onCheckedChange={setIncludeUppercase} />
                    </div>
                    <div className="flex items-center justify-between space-x-2">
                      <Label htmlFor="lowercase">Lowercase (a-z)</Label>
                      <Switch id="lowercase" checked={includeLowercase} onCheckedChange={setIncludeLowercase} />
                    </div>
                    <div className="flex items-center justify-between space-x-2">
                      <Label htmlFor="numbers">Numbers (0-9)</Label>
                      <Switch id="numbers" checked={includeNumbers} onCheckedChange={setIncludeNumbers} />
                    </div>
                    <div className="flex items-center justify-between space-x-2">
                      <Label htmlFor="symbols">Symbols (!@#$)</Label>
                      <Switch id="symbols" checked={includeSymbols} onCheckedChange={setIncludeSymbols} />
                    </div>
                  </div>
                </div>

                {/* Advanced Options */}
                <Accordion type="single" collapsible className="border-t pt-2">
                  <AccordionItem value="advanced" className="border-none">
                    <AccordionTrigger className="text-sm text-muted-foreground hover:no-underline">
                      Advanced Options
                    </AccordionTrigger>
                    <AccordionContent className="space-y-4 pt-4">
                      <div className="flex items-center justify-between space-x-2">
                        <Label htmlFor="ambiguous">Exclude Ambiguous (i, l, 1, L, o, 0, O)</Label>
                        <Switch id="ambiguous" checked={excludeAmbiguous} onCheckedChange={setExcludeAmbiguous} />
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>

                {/* Generate Button */}
                <Button onClick={handleGeneratePassword} size="lg" className="w-full text-lg">
                  <RefreshCw className="mr-2 h-5 w-5" />
                  Generate Password
                </Button>
              </TabsContent>

              {/* Passphrase Configuration */}
              <TabsContent value="passphrase" className="space-y-6">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label>Number of Words</Label>
                      <span className="text-sm font-medium">{wordCount[0]}</span>
                    </div>
                    <Slider
                      value={wordCount}
                      onValueChange={setWordCount}
                      min={3}
                      max={10}
                      step={1}
                      className="w-full"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Source Language</Label>
                      <Select 
                        value={sourceLanguage} 
                        onValueChange={(value) => {
                          setSourceLanguage(value as "en" | "uk")
                          // Reset to first available dictionary when language changes
                          if (value === "en") {
                            setWordlist("eff-large")
                          } else {
                            setWordlist("wordlist")
                          }
                        }}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="en">English</SelectItem>
                          <SelectItem value="uk">Ukrainian</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label>Wordlist</Label>
                      <Select value={wordlist} onValueChange={setWordlist}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {sourceLanguage === "en" && (
                            <>
                              <SelectItem value="eff-large">{AVAILABLE_DICTIONARIES.en["eff-large"].description}</SelectItem>
                              <SelectItem value="eff-short">{AVAILABLE_DICTIONARIES.en["eff-short"].description}</SelectItem>
                              <SelectItem value="eff-short-2">{AVAILABLE_DICTIONARIES.en["eff-short-2"].description}</SelectItem>
                              <SelectItem value="original">{AVAILABLE_DICTIONARIES.en.original.description}</SelectItem>
                              <SelectItem value="beale">{AVAILABLE_DICTIONARIES.en.beale.description}</SelectItem>
                            </>
                          )}
                          {sourceLanguage === "uk" && (
                            <>
                              <SelectItem value="wordlist">{AVAILABLE_DICTIONARIES.uk.wordlist.description}</SelectItem>
                              <SelectItem value="small">{AVAILABLE_DICTIONARIES.uk.small.description}</SelectItem>
                              <SelectItem value="normal">{AVAILABLE_DICTIONARIES.uk.normal.description}</SelectItem>
                              <SelectItem value="large">{AVAILABLE_DICTIONARIES.uk.large.description}</SelectItem>
                            </>
                          )}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label>Capitalization</Label>
                      <Select value={capitalization} onValueChange={(value) => setCapitalization(value as CapitalizationStyle)}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="none">None (lowercase)</SelectItem>
                          <SelectItem value="first">First Letter</SelectItem>
                          <SelectItem value="random">Random Letter</SelectItem>
                          <SelectItem value="all">All Uppercase</SelectItem>
                          <SelectItem value="random-word">Random Word Uppercase</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="flex items-center justify-between space-x-2">
                        <Label htmlFor="numbers2">Add Numbers</Label>
                        <Switch id="numbers2" checked={includeNumbers2} onCheckedChange={setIncludeNumbers2} />
                      </div>
                      {sourceLanguage === "uk" && (
                        <div className="flex items-center justify-between space-x-2">
                          <Label htmlFor="transliteration">Transliteration</Label>
                          <Switch
                            id="transliteration"
                            checked={showTransliteration}
                            onCheckedChange={setShowTransliteration}
                          />
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Advanced Options */}
                <Accordion type="single" collapsible className="border-t pt-2">
                  <AccordionItem value="advanced" className="border-none">
                    <AccordionTrigger className="text-sm text-muted-foreground hover:no-underline">
                      Advanced Options
                    </AccordionTrigger>
                    <AccordionContent className="space-y-4 pt-4">
                      <div className="space-y-2">
                        <Label>Word Separator</Label>
                        <div className="grid grid-cols-3 gap-2">
                          {[
                            { value: "-", label: "Dash" },
                            { value: "_", label: "Underscore" },
                            { value: " ", label: "Space" },
                            { value: ".", label: "Period" },
                            { value: "", label: "None" },
                            { value: "custom", label: "Custom" },
                          ].map((sep) => (
                            <Button
                              key={sep.value}
                              variant={separator === sep.value ? "default" : "outline"}
                              size="sm"
                              onClick={() => setSeparator(sep.value)}
                              className="w-full"
                            >
                              {sep.label}
                            </Button>
                          ))}
                        </div>
                        {separator === "custom" && (
                          <Input
                            placeholder="Enter separator (e.g., *, |)"
                            value={customSeparator}
                            onChange={(e) => setCustomSeparator(e.target.value)}
                            maxLength={3}
                            className="mt-2"
                          />
                        )}
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>

                {/* Generate Button */}
                <Button 
                  onClick={handleGeneratePassphrase} 
                  size="lg" 
                  className="w-full text-lg"
                  disabled={isGeneratingPassphrase}
                >
                  <RefreshCw className={`mr-2 h-5 w-5 ${isGeneratingPassphrase ? "animate-spin" : ""}`} />
                  {isGeneratingPassphrase ? "Generating..." : "Generate Passphrase"}
                </Button>
              </TabsContent>

              {/* Learn Tab */}
              <TabsContent value="learn" className="space-y-6">
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
              </TabsContent>
            </Tabs>

            {/* Output Display */}
            {generatedPassword && activeTab !== "learn" && (
              <div className="mt-8 space-y-4 rounded-lg border-2 bg-muted/30 p-6">
                <div className="space-y-2">
                  <div className="flex items-start justify-between gap-4">
                    <code className="break-all text-lg font-mono leading-relaxed">{generatedPassword}</code>
                    <div className="flex shrink-0 gap-2">
                      <Button size="icon" variant="ghost" onClick={copyToClipboard} className="h-8 w-8">
                        <Copy className="h-4 w-4" />
                      </Button>
                      <Button
                        size="icon"
                        variant="ghost"
                        onClick={activeTab === "password" ? handleGeneratePassword : handleGeneratePassphrase}
                        className="h-8 w-8"
                        disabled={activeTab === "passphrase" && isGeneratingPassphrase}
                      >
                        <RefreshCw className={`h-4 w-4 ${isGeneratingPassphrase ? "animate-spin" : ""}`} />
                      </Button>
                    </div>
                  </div>
                </div>

                <div className="space-y-4 border-t pt-4">
                  {/* Strength Indicator */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Strength</span>
                      <span className="font-medium">{getStrengthFromEntropy(entropy).label}</span>
                    </div>
                    <div className="h-2 w-full overflow-hidden rounded-full bg-secondary">
                      <div
                        className={`h-full transition-all duration-500 ${getStrengthFromEntropy(entropy).color}`}
                        style={{ width: `${Math.min((entropy / 128) * 100, 100)}%` }}
                      />
                    </div>
                  </div>

                  {/* Security Metrics Grid */}
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div className="space-y-1">
                      <p className="text-muted-foreground">Entropy</p>
                      <p className="font-mono font-medium">{entropy.toFixed(2)} bits</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-muted-foreground">Combinations</p>
                      <p className="font-mono font-medium">{getCombinationsFormatted()}</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-muted-foreground">Time to Crack (avg)</p>
                      <p className="font-mono font-medium">{getTimeToCrackFormatted()}</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-muted-foreground">Cost to Crack (avg)</p>
                      <p className="font-mono font-medium">{getCostToCrackFormatted()}</p>
                    </div>
                  </div>

                  {/* Configurable Metrics */}
                  <Accordion type="single" collapsible className="border-t pt-2">
                    <AccordionItem value="metrics-config" className="border-none">
                      <AccordionTrigger className="text-sm text-muted-foreground hover:no-underline">
                        Configure Metrics
                      </AccordionTrigger>
                      <AccordionContent className="space-y-4 pt-4">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label>Guess Rate (guesses/sec)</Label>
                            <Select value={guessRate} onValueChange={setGuessRate}>
                              <SelectTrigger>
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="1e6">1 Million (1e6)</SelectItem>
                                <SelectItem value="1e9">1 Billion (1e9)</SelectItem>
                                <SelectItem value="1e12">1 Trillion (1e12)</SelectItem>
                                <SelectItem value="1e15">1 Quadrillion (1e15)</SelectItem>
                                <SelectItem value="custom">Custom</SelectItem>
                              </SelectContent>
                            </Select>
                            {guessRate === "custom" && (
                              <Input
                                type="number"
                                placeholder="Enter guesses per second"
                                value={customGuessRate}
                                onChange={(e) => setCustomGuessRate(e.target.value)}
                                className="mt-2"
                              />
                            )}
                          </div>

                          <div className="space-y-2">
                            <Label>Cost per 2^32 Guesses ($)</Label>
                            <Select value={costPer32} onValueChange={setCostPer32}>
                              <SelectTrigger>
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="0.001">$0.001</SelectItem>
                                <SelectItem value="0.01">$0.01</SelectItem>
                                <SelectItem value="0.1">$0.10</SelectItem>
                                <SelectItem value="1">$1.00</SelectItem>
                                <SelectItem value="custom">Custom</SelectItem>
                              </SelectContent>
                            </Select>
                            {costPer32 === "custom" && (
                              <Input
                                type="number"
                                step="0.001"
                                placeholder="Enter cost per 2^32 guesses"
                                value={customCostPer32}
                                onChange={(e) => setCustomCostPer32(e.target.value)}
                                className="mt-2"
                              />
                            )}
                          </div>
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                  </Accordion>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Security Notice */}
        <p className="mt-6 text-center text-xs text-muted-foreground">
          All passwords are generated locally in your browser. Nothing is stored or transmitted.
        </p>

        {/* Footer with GitHub and contact links */}
        <footer className="mt-8 border-t pt-6">
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 text-sm text-muted-foreground">
            <a
              href="https://github.com/yourusername/passphrase-ua"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 hover:text-foreground transition-colors"
            >
              <Github className="h-4 w-4" />
              View on GitHub
            </a>
            <span className="hidden sm:inline">•</span>
            <a
              href="mailto:contact@example.com"
              className="flex items-center gap-2 hover:text-foreground transition-colors"
            >
              <Mail className="h-4 w-4" />
              Contact
            </a>
          </div>
        </footer>
      </div>
    </main>
  )
}
