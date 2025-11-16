"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/app/components/ui/card"
import { Shield, Lock, Eye, Database, Code, Cookie } from "lucide-react"
import Link from "next/link"
import { ThemeToggle } from "@/app/components/theme-toggle"
import { LanguageToggle } from "@/app/components/language-toggle"
import { useI18n } from "@/lib/i18n"

export default function PrivacyPage() {
  const { t, locale } = useI18n()
  const currentDate = new Date().toLocaleDateString(locale === "uk" ? "uk-UA" : "en-US", { 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  })

  return (
    <main className="min-h-screen bg-background py-12 px-4">
      <div className="mx-auto max-w-4xl">
        {/* Header */}
        <div className="mb-8">
          <div className="mb-4 flex items-center justify-end gap-2">
            <LanguageToggle />
            <ThemeToggle />
          </div>
          <div className="mb-2 flex items-center gap-2">
            <Shield className="h-8 w-8 text-primary" />
            <h1 className="text-4xl font-bold tracking-tight">
              {locale === "uk" ? "Політика конфіденційності" : "Privacy Policy"}
            </h1>
          </div>
          <p className="text-muted-foreground">
            {locale === "uk" 
              ? `Остання актуалізація: ${currentDate}` 
              : `Last Updated: ${currentDate}`}
          </p>
        </div>

        {/* Main Content */}
        <div className="space-y-6">
          {/* Overview */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Eye className="h-5 w-5" />
                {locale === "uk" ? "Огляд" : "Overview"}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-lg font-semibold text-primary">
                {locale === "uk" 
                  ? "Ми НЕ збираємо жодних даних. Ніколи." 
                  : "We DO NOT collect any data. Ever."}
              </p>
              <p className="text-muted-foreground">
                {locale === "uk"
                  ? "Passphrase UA — це повністю клієнтський застосунок, створений з акцентом на конфіденційність. Усі паролі та парольні фрази генеруються локально у вашому браузері та ніколи не передаються через мережу, не зберігаються на наших серверах і не відстежуються жодним чином."
                  : "Passphrase UA is a completely client-side application built with privacy as the core principle. All passwords and passphrases are generated locally in your browser and are never transmitted over the network, stored on our servers, or tracked in any way."}
              </p>
            </CardContent>
          </Card>

          {/* What We Don't Collect */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Database className="h-5 w-5" />
                {locale === "uk" ? "Що ми НЕ збираємо" : "What We DON'T Collect"}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3 text-muted-foreground">
                <li className="flex items-start gap-2">
                  <span className="text-destructive font-bold mt-1">✗</span>
                  <span>
                    {locale === "uk"
                      ? "Паролі або згенеровані парольні фрази"
                      : "Passwords or generated passphrases"}
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-destructive font-bold mt-1">✗</span>
                  <span>
                    {locale === "uk"
                      ? "Облікові записи користувачів або адреси електронної пошти"
                      : "User accounts or email addresses"}
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-destructive font-bold mt-1">✗</span>
                  <span>
                    {locale === "uk"
                      ? "IP-адреси або інформацію про місцезнаходження"
                      : "IP addresses or location information"}
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-destructive font-bold mt-1">✗</span>
                  <span>
                    {locale === "uk"
                      ? "Аналітику використання або телеметрію"
                      : "Usage analytics or telemetry"}
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-destructive font-bold mt-1">✗</span>
                  <span>
                    {locale === "uk"
                      ? "Відбитки пристроїв або файли cookie відстеження"
                      : "Device fingerprints or tracking cookies"}
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-destructive font-bold mt-1">✗</span>
                  <span>
                    {locale === "uk"
                      ? "Будь-які персональні дані"
                      : "Any personal data whatsoever"}
                  </span>
                </li>
              </ul>
            </CardContent>
          </Card>

          {/* What We Store Locally */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Cookie className="h-5 w-5" />
                {locale === "uk" ? "Що зберігається локально" : "What We Store Locally"}
              </CardTitle>
              <CardDescription>
                {locale === "uk"
                  ? "У вашому браузері (localStorage) — під вашим контролем"
                  : "In your browser (localStorage) — under your control"}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3 text-muted-foreground">
                <li className="flex items-start gap-2">
                  <span className="text-primary font-bold mt-1">✓</span>
                  <div>
                    <span className="font-semibold text-foreground">
                      {locale === "uk" ? "Вибір теми" : "Theme Preference"}
                    </span>
                    {" — "}
                    {locale === "uk"
                      ? "Ваш вибір між світлою/темною темою (passphrase-ua-theme)"
                      : "Your choice of light/dark mode (passphrase-ua-theme)"}
                  </div>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary font-bold mt-1">✓</span>
                  <div>
                    <span className="font-semibold text-foreground">
                      {locale === "uk" ? "Вибір мови" : "Language Preference"}
                    </span>
                    {" — "}
                    {locale === "uk"
                      ? "Ваш вибір між українською/англійською мовою (locale)"
                      : "Your choice of Ukrainian/English (locale)"}
                  </div>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-destructive font-bold mt-1">✗</span>
                  <div>
                    <span className="font-semibold text-foreground">
                      {locale === "uk" ? "Без паролів" : "No Passwords"}
                    </span>
                    {" — "}
                    {locale === "uk"
                      ? "Паролі ніколи не зберігаються, навіть локально"
                      : "Passwords are never stored, even locally"}
                  </div>
                </li>
              </ul>
              <p className="mt-4 text-sm text-muted-foreground">
                {locale === "uk"
                  ? "Ви можете очистити ці налаштування в будь-який час, видаливши дані сайту в налаштуваннях вашого браузера."
                  : "You can clear these settings at any time by clearing site data in your browser settings."}
              </p>
            </CardContent>
          </Card>

          {/* How It Works */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Code className="h-5 w-5" />
                {locale === "uk" ? "Як це працює" : "How It Works"}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-muted-foreground">
              <div>
                <h3 className="font-semibold text-foreground mb-2">
                  {locale === "uk" ? "1. Генерація лише на стороні клієнта" : "1. Client-Side Only Generation"}
                </h3>
                <p>
                  {locale === "uk"
                    ? "Усі паролі та парольні фрази генеруються локально у вашому браузері за допомогою Web Crypto API (crypto.getRandomValues()). Код генерації є чистою функцією JavaScript, яка виконується виключно на вашому пристрої."
                    : "All passwords and passphrases are generated locally in your browser using the Web Crypto API (crypto.getRandomValues()). The generation code is pure JavaScript function that runs exclusively on your device."}
                </p>
              </div>
              <div>
                <h3 className="font-semibold text-foreground mb-2">
                  {locale === "uk" ? "2. Без мережевих запитів" : "2. No Network Requests"}
                </h3>
                <p>
                  {locale === "uk"
                    ? "Під час генерації паролів мережеві запити не виконуються. Ви можете перевірити це, відкривши інструменти розробника вашого браузера (вкладка Мережа) — ви не побачите жодних запитів під час генерації."
                    : "No network requests are made during password generation. You can verify this by opening your browser's Developer Tools (Network tab) — you won't see any requests during generation."}
                </p>
              </div>
              <div>
                <h3 className="font-semibold text-foreground mb-2">
                  {locale === "uk" ? "3. Відкритий вихідний код" : "3. Open Source"}
                </h3>
                <p>
                  {locale === "uk"
                    ? "Весь код відкритий і доступний на GitHub для аудиту. Ви можете перевірити кожен рядок коду, щоб переконатися, що ми дотримуємося своїх обіцянок щодо конфіденційності."
                    : "All code is open source and available on GitHub for audit. You can review every line of code to verify we keep our privacy promises."}
                </p>
              </div>
            </CardContent>
          </Card>

          {/* GDPR Compliance */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Lock className="h-5 w-5" />
                {locale === "uk" ? "Відповідність GDPR" : "GDPR Compliance"}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-muted-foreground">
              <p>
                {locale === "uk"
                  ? "Passphrase UA повністю відповідає Загальному регламенту захисту даних (GDPR) та іншим законам про конфіденційність, оскільки ми:"
                  : "Passphrase UA is fully compliant with the General Data Protection Regulation (GDPR) and other privacy laws because we:"}
              </p>
              <ul className="space-y-2 ml-6 list-disc">
                <li>
                  {locale === "uk"
                    ? "Не збираємо жодних персональних даних"
                    : "Do not collect any personal data"}
                </li>
                <li>
                  {locale === "uk"
                    ? "Не обробляємо жодної інформації, яка ідентифікує користувача"
                    : "Do not process any user-identifying information"}
                </li>
                <li>
                  {locale === "uk"
                    ? "Не використовуємо файли cookie для відстеження"
                    : "Do not use tracking cookies"}
                </li>
                <li>
                  {locale === "uk"
                    ? "Надаємо користувачам повний контроль над своїми налаштуваннями"
                    : "Give users full control over their settings"}
                </li>
              </ul>
              <p>
                {locale === "uk"
                  ? "Оскільки ми не збираємо жодних даних, немає даних для запиту, експорту чи видалення."
                  : "Since we collect no data, there is no data to request, export, or delete."}
              </p>
            </CardContent>
          </Card>

          {/* Security */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5" />
                {locale === "uk" ? "Безпека" : "Security"}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-muted-foreground">
              <p>
                {locale === "uk"
                  ? "Ми реалізували численні заходи безпеки для захисту вашої конфіденційності:"
                  : "We implement numerous security measures to protect your privacy:"}
              </p>
              <ul className="space-y-2 ml-6 list-disc">
                <li>
                  {locale === "uk"
                    ? "Криптографічно безпечна генерація випадкових чисел (Web Crypto API)"
                    : "Cryptographically secure random number generation (Web Crypto API)"}
                </li>
                <li>
                  {locale === "uk"
                    ? "Суворі заголовки Політики безпеки вмісту (CSP)"
                    : "Strict Content Security Policy (CSP) headers"}
                </li>
                <li>
                  {locale === "uk"
                    ? "HTTPS за замовчуванням з HSTS (HTTP Strict Transport Security)"
                    : "HTTPS by default with HSTS (HTTP Strict Transport Security)"}
                </li>
                <li>
                  {locale === "uk"
                    ? "Без сторонніх скриптів або відстеження"
                    : "No third-party scripts or tracking"}
                </li>
                <li>
                  {locale === "uk"
                    ? "Регулярні аудити безпеки"
                    : "Regular security audits"}
                </li>
              </ul>
            </CardContent>
          </Card>

          {/* Changes to Policy */}
          <Card>
            <CardHeader>
              <CardTitle>
                {locale === "uk" ? "Зміни в цій політиці" : "Changes to This Policy"}
              </CardTitle>
            </CardHeader>
            <CardContent className="text-muted-foreground">
              <p>
                {locale === "uk"
                  ? "Якщо ми внесемо зміни до цієї політики конфіденційності, ми оновимо дату «Остання актуалізація» вгорі цієї сторінки. Оскільки ми не збираємо контактну інформацію, ми не можемо повідомити вас безпосередньо про зміни. Рекомендуємо періодично переглядати цю сторінку."
                  : "If we make changes to this privacy policy, we will update the \"Last Updated\" date at the top of this page. Since we don't collect contact information, we cannot notify you directly of changes. We encourage you to review this page periodically."}
              </p>
            </CardContent>
          </Card>

          {/* Contact */}
          <Card>
            <CardHeader>
              <CardTitle>
                {locale === "uk" ? "Контакт" : "Contact"}
              </CardTitle>
            </CardHeader>
            <CardContent className="text-muted-foreground">
              <p>
                {locale === "uk"
                  ? "Якщо у вас є питання щодо цієї політики конфіденційності або практик конфіденційності Passphrase UA, ви можете:"
                  : "If you have questions about this privacy policy or Passphrase UA's privacy practices, you can:"}
              </p>
              <ul className="mt-4 space-y-2 ml-6 list-disc">
                <li>
                  {locale === "uk" ? "Відкрити проблему на " : "Open an issue on "}
                  <a 
                    href="https://github.com/git-leaf/passphrase-ua" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-primary hover:underline"
                  >
                    GitHub
                  </a>
                </li>
                <li>
                  {locale === "uk" 
                    ? "Переглянути вихідний код для повної прозорості"
                    : "Review the source code for complete transparency"}
                </li>
              </ul>
            </CardContent>
          </Card>
        </div>

        {/* Back to Home */}
        <div className="mt-8 text-center">
          <Link 
            href="/" 
            className="text-primary hover:underline inline-flex items-center gap-2"
          >
            ← {locale === "uk" ? "Повернутися до генератора" : "Back to Generator"}
          </Link>
        </div>
      </div>
    </main>
  )
}

