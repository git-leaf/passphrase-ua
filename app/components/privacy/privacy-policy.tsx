"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/app/components/ui/card"
import { Shield, Lock, Eye, Database, Code, Cookie, Server } from "lucide-react"
import Link from "next/link"
import { ThemeToggle } from "@/app/components/theme-toggle"
import { LanguageToggle } from "@/app/components/language-toggle"
import { useI18n } from "@/app/components/i18n-provider"
import { pagePath } from "@/lib/i18n"

/**
 * The privacy policy, in the page's language
 */
export function PrivacyPolicy() {
  const { locale, t } = useI18n()

  return (
    <main className="min-h-screen bg-background py-12 px-4">
      <div className="mx-auto max-w-4xl">
        {/* Header */}
        <div className="mb-8">
          <div className="mb-4 flex items-center justify-end gap-2">
            <LanguageToggle page="privacy" />
            <ThemeToggle />
          </div>
          <div className="mb-2 flex items-center gap-2">
            <Shield className="h-8 w-8 text-primary" />
            <h1 className="text-4xl font-bold tracking-tight">{t.privacy.title}</h1>
          </div>
          <p className="text-muted-foreground">
            {t.privacy.lastUpdated} {t.privacy.lastUpdatedDate}
          </p>
        </div>

        {/* Main Content */}
        <div className="space-y-6">
          {/* Overview */}
          <Card>
            <CardHeader>
              <CardTitle asChild className="flex items-center gap-2">
                <h2>
                  <Eye className="h-5 w-5" />
                  {t.privacy.overview.title}
                </h2>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-lg font-semibold text-primary">{t.privacy.overview.noDataMessage}</p>
              <p className="text-muted-foreground">{t.privacy.overview.description}</p>
            </CardContent>
          </Card>

          {/* What We Don't Collect */}
          <Card>
            <CardHeader>
              <CardTitle asChild className="flex items-center gap-2">
                <h2>
                  <Database className="h-5 w-5" />
                  {t.privacy.whatWeDontCollect.title}
                </h2>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3 text-muted-foreground">
                <li className="flex items-start gap-2">
                  <span className="text-destructive font-bold mt-1">✗</span>
                  <span>{t.privacy.whatWeDontCollect.passwords}</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-destructive font-bold mt-1">✗</span>
                  <span>{t.privacy.whatWeDontCollect.accounts}</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-destructive font-bold mt-1">✗</span>
                  <span>{t.privacy.whatWeDontCollect.analytics}</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-destructive font-bold mt-1">✗</span>
                  <span>{t.privacy.whatWeDontCollect.fingerprints}</span>
                </li>
              </ul>
            </CardContent>
          </Card>

          {/* Hosting */}
          <Card>
            <CardHeader>
              <CardTitle asChild className="flex items-center gap-2">
                <h2>
                  <Server className="h-5 w-5" />
                  {t.privacy.hosting.title}
                </h2>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-muted-foreground">
              <p>{t.privacy.hosting.description}</p>
              <p>
                {t.privacy.hosting.policyLinkBefore}
                <a
                  href="https://vercel.com/legal/privacy-policy"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary underline underline-offset-4"
                >
                  {t.privacy.hosting.policyLink}
                </a>
                .
              </p>
            </CardContent>
          </Card>

          {/* What We Store Locally */}
          <Card>
            <CardHeader>
              <CardTitle asChild className="flex items-center gap-2">
                <h2>
                  <Cookie className="h-5 w-5" />
                  {t.privacy.whatWeStoreLocally.title}
                </h2>
              </CardTitle>
              <CardDescription>{t.privacy.whatWeStoreLocally.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3 text-muted-foreground">
                <li className="flex items-start gap-2">
                  <span className="text-primary font-bold mt-1">✓</span>
                  <div>
                    <span className="font-semibold text-foreground">
                      {t.privacy.whatWeStoreLocally.themePreference}
                    </span>
                    {" — "}
                    {t.privacy.whatWeStoreLocally.themeDescription}
                  </div>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary font-bold mt-1">✓</span>
                  <div>
                    <span className="font-semibold text-foreground">
                      {t.privacy.whatWeStoreLocally.languagePreference}
                    </span>
                    {" — "}
                    {t.privacy.whatWeStoreLocally.languageDescription}
                  </div>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary font-bold mt-1">✓</span>
                  <div>
                    <span className="font-semibold text-foreground">{t.privacy.whatWeStoreLocally.offlineCopy}</span>
                    {" — "}
                    {t.privacy.whatWeStoreLocally.offlineCopyDescription}
                  </div>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-destructive font-bold mt-1">✗</span>
                  <div>
                    <span className="font-semibold text-foreground">{t.privacy.whatWeStoreLocally.noPasswords}</span>
                    {" — "}
                    {t.privacy.whatWeStoreLocally.noPasswordsDescription}
                  </div>
                </li>
              </ul>
              <p className="mt-4 text-sm text-muted-foreground">{t.privacy.whatWeStoreLocally.clearSettings}</p>
            </CardContent>
          </Card>

          {/* How It Works */}
          <Card>
            <CardHeader>
              <CardTitle asChild className="flex items-center gap-2">
                <h2>
                  <Code className="h-5 w-5" />
                  {t.privacy.howItWorks.title}
                </h2>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-muted-foreground">
              <div>
                <h3 className="font-semibold text-foreground mb-2">
                  {t.privacy.howItWorks.clientSideGeneration.title}
                </h3>
                <p>{t.privacy.howItWorks.clientSideGeneration.description}</p>
              </div>
              <div>
                <h3 className="font-semibold text-foreground mb-2">{t.privacy.howItWorks.noSecretSent.title}</h3>
                <p>{t.privacy.howItWorks.noSecretSent.description}</p>
              </div>
              <div>
                <h3 className="font-semibold text-foreground mb-2">{t.privacy.howItWorks.openSource.title}</h3>
                <p>{t.privacy.howItWorks.openSource.description}</p>
              </div>
            </CardContent>
          </Card>

          {/* Your Data */}
          <Card>
            <CardHeader>
              <CardTitle asChild className="flex items-center gap-2">
                <h2>
                  <Lock className="h-5 w-5" />
                  {t.privacy.yourData.title}
                </h2>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-muted-foreground">
              <p>{t.privacy.yourData.description}</p>
              <ul className="space-y-2 ml-6 list-disc">
                <li>{t.privacy.yourData.noPersonalData}</li>
                <li>{t.privacy.yourData.noUserIdentifyingInfo}</li>
                <li>{t.privacy.yourData.noTrackingCookies}</li>
                <li>{t.privacy.yourData.userControl}</li>
              </ul>
              <p>{t.privacy.yourData.noDataToManage}</p>
            </CardContent>
          </Card>

          {/* Security */}
          <Card>
            <CardHeader>
              <CardTitle asChild className="flex items-center gap-2">
                <h2>
                  <Shield className="h-5 w-5" />
                  {t.privacy.security.title}
                </h2>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-muted-foreground">
              <p>{t.privacy.security.description}</p>
              <ul className="space-y-2 ml-6 list-disc">
                <li>{t.privacy.security.cryptoSecureRng}</li>
                <li>{t.privacy.security.contentSecurityPolicy}</li>
                <li>{t.privacy.security.httpsWithHsts}</li>
                <li>{t.privacy.security.noThirdPartyScripts}</li>
                <li>{t.privacy.security.automatedChecks}</li>
              </ul>
            </CardContent>
          </Card>

          {/* Changes to Policy */}
          <Card>
            <CardHeader>
              <CardTitle asChild>
                <h2>{t.privacy.changesToPolicy.title}</h2>
              </CardTitle>
            </CardHeader>
            <CardContent className="text-muted-foreground">
              <p>{t.privacy.changesToPolicy.description}</p>
            </CardContent>
          </Card>

          {/* Contact */}
          <Card>
            <CardHeader>
              <CardTitle asChild>
                <h2>{t.privacy.contact.title}</h2>
              </CardTitle>
            </CardHeader>
            <CardContent className="text-muted-foreground">
              <p>{t.privacy.contact.description}</p>
              <ul className="mt-4 space-y-2 ml-6 list-disc">
                <li>
                  {t.privacy.contact.openIssueOn}
                  <a
                    href="https://github.com/git-leaf/passphrase-ua"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary underline underline-offset-4"
                  >
                    GitHub
                  </a>
                </li>
                <li>{t.privacy.contact.reviewSourceCode}</li>
              </ul>
            </CardContent>
          </Card>
        </div>

        {/* Back to Home */}
        <div className="mt-8 text-center">
          <Link
            href={pagePath("passphrase", locale)}
            className="text-primary hover:underline inline-flex items-center gap-2"
          >
            ← {t.privacy.backToGenerator}
          </Link>
        </div>
      </div>
    </main>
  )
}
