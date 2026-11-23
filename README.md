# Mova Pass 🔐

**Client-side password and passphrase generator with first-class Ukrainian language support**

Mova Pass (formerly Passphrase UA) is a secure, privacy-focused tool for generating strong passwords and memorable passphrases. It features the first comprehensive Ukrainian Diceware wordlists with transliteration support, alongside trusted English wordlists.

---

## 🇺🇦 Support Ukraine

**Support Ukrainian charities and humanitarian efforts**

Help Ukraine defend against Russian aggression. Your contributions make a real difference in supporting the brave Ukrainian people!

### Trusted Organizations

- [**Come Back Alive**](https://savelife.in.ua/en/)
- [**Serhiy Prytula Foundation**](https://prytulafoundation.org/en)
- [**United24**](https://u24.gov.ua/)
- [**Sternenko Fund**](https://www.sternenkofund.org/en)

### Personal Fundraising

Support the developer's personal charity efforts through [**Monobank Charity Jar**](https://send.monobank.ua/jar/4JzF7j6qAc).

---

## ✨ Features

### Generation Methods

- **Random Passwords** — Cryptographically secure character-based passwords with customizable length and character sets
- **Diceware Passphrases** — Memorable word-based passphrases using the proven Diceware method

### Ukrainian Support (First Implementation!)

- 🇺🇦 **Ukrainian Wordlists**: two Diceware lists and a larger general Wordlist (see [Supported Languages](#-supported-languages))
- 🔤 **Transliteration**: Ukrainian words in Latin letters (e.g., "собака" → "sobaka"), for sites and keyboards without Cyrillic

### Security & Privacy

- ✅ **100% Client-side** — All generation happens in your browser, nothing sent to servers
- ✅ **Cryptographically Secure** — Uses `crypto.getRandomValues()` Web Crypto API
- ✅ **No Tracking** — Zero analytics, no accounts, no cookies; no Secret ever leaves your browser
- ✅ **Offline Support** — Works without internet connection after first load: a service worker keeps the app and every Wordlist
- ✅ **Open Source** — Fully auditable code

### User Experience

- 📊 **Strength Meter** — Real-time entropy calculation and time-to-crack estimates
- 🎨 **Dark/Light Modes** — System preference detection with manual toggle
- ♿ **Accessible** — WCAG 2.1 AA compliant, keyboard navigation, screen reader support (automated axe checks in the tests and in a real browser, contrast included; manual audit: [#25](https://github.com/git-leaf/passphrase-ua/issues/25))
- 📱 **Responsive** — Mobile-first design, works on all screen sizes

---

## 🚀 Quick Start

### Prerequisites

- [pnpm](https://pnpm.io/installation). It installs the pinned Node.js 26 for the project's scripts by itself.

### Installation

```bash
# Clone the repository
git clone https://github.com/git-leaf/passphrase-ua.git
cd passphrase-ua

# Install dependencies
pnpm install

# Run development server
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Available Scripts

```bash
pnpm dev      # Start development server
pnpm check    # Format, lint, types, tests with coverage, build
pnpm check:browser  # Build, then check contrast, <html lang> and offline use in Chrome
pnpm format   # Format all files with Prettier
pnpm lint     # Run ESLint
pnpm test     # Run tests
pnpm test:watch  # Run tests in watch mode
pnpm build    # Build for production
pnpm start    # Start production server
```

---

## 📚 Documentation

- **[CONTRIBUTING.md](CONTRIBUTING.md)**: workflow and conventions
- **[GLOSSARY.md](GLOSSARY.md)**: the domain vocabulary
- **[docs/adr/](docs/adr/)**: decisions and why they were made, including the [product principles](docs/adr/0010-product-principles.md)
- **[SECURITY.md](SECURITY.md)**: how to report a vulnerability, and the threat model

---

## 🛠️ Tech Stack

- **Framework**: Next.js 16 (App Router) + React 19 + TypeScript
- **UI**: Tailwind CSS + shadcn/ui + Radix UI
- **Security**: Web Crypto API (`crypto.getRandomValues()`)
- **Build**: pnpm

---

## 🌍 Supported Languages

### Ukrainian

- Wordlist (10,870 words)
- Short Diceware (1,296 words, 4 dice)
- Long Diceware (7,776 words, 5 dice)

_All with English transliteration support_

The Ukrainian dictionaries and Diceware wordlists were developed by the same author in another repository, [diceware-ua](https://github.com/git-leaf/diceware-ua), which holds the source CSV and TXT files (and tooling used to build them). This app bundles copies under `public/wordlists/uk/`.

### English

- EFF Large (7,776 words)
- EFF Short (1,296 words)
- EFF Short 2 (1,296 words, every word with a unique three-letter prefix)
- Original Diceware (7,776 words)
- Beale (7,776 words)

---

## 🤝 Contributing

Contributions are welcome! Read [CONTRIBUTING.md](CONTRIBUTING.md) for the workflow and conventions, and open a [GitHub issue](https://github.com/git-leaf/passphrase-ua/issues) for proposals, bugs, documentation fixes or new wordlists and languages. Please talk to the maintainer before starting larger changes.

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 🙏 Acknowledgments

- [Arnold G. Reinhold](https://theworld.com/~reinhold/diceware.html) — Creator of the Diceware method
- [Electronic Frontier Foundation (EFF)](https://www.eff.org/dice) — EFF wordlists
- [diceware-ua](https://github.com/git-leaf/diceware-ua) — The maintainer's sister project: Ukrainian dictionaries and Diceware wordlists (authored there), with per-list folders (CSV/TXT), notebooks, and curation tools. This app ships bundled copies; wordlist changes and contributions belong in that repository.
- Inspired by [Diceware Password Generator](https://diceware.dmuth.org/) and [StrongPhrase](https://strongphrase.net/)

---

## 🔒 Security Notice

All password generation occurs entirely in your browser using cryptographically secure random number generation. No password is ever stored, logged, or sent to any server: the only network requests download the pages and wordlists, which Vercel, the host, records in its request logs (see [SECURITY.md](SECURITY.md)). You can verify this by inspecting the network activity in your browser's developer tools.

---

**Made with 🇺🇦 for privacy-conscious users worldwide**
