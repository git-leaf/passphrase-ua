# Mova Pass 🔐 (formerly Passphrase UA)

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
- 🇺🇦 **Ukrainian Wordlists**: Small (1,296 words), Normal (7,776 words), Large (46,656 words)
- 🔤 **Transliteration**: Type Ukrainian words using Latin characters (e.g., "собака" → "sobaka")

### Security & Privacy
- ✅ **100% Client-side** — All generation happens in your browser, nothing sent to servers
- ✅ **Cryptographically Secure** — Uses `crypto.getRandomValues()` Web Crypto API
- ✅ **No Tracking** — Zero analytics, no data collection, complete privacy
- ✅ **Offline Support** — Works without internet connection after first load
- ✅ **Open Source** — Fully auditable code

### User Experience
- 📊 **Strength Meter** — Real-time entropy calculation and time-to-crack estimates
- 🎨 **Dark/Light Modes** — System preference detection with manual toggle
- ♿ **Accessible** — WCAG 2.1 AA compliant, keyboard navigation, screen reader support
- 📱 **Responsive** — Mobile-first design, works on all screen sizes

---

## 🚀 Quick Start

### Prerequisites
- Node.js 20+ and pnpm

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
pnpm build    # Build for production
pnpm start    # Start production server
pnpm lint     # Run linter
```

---

## 📚 Documentation

For comprehensive information about the project:

- **[Product Requirements Document (PRD)](docs/prd.md)** — Complete project specification, architecture, requirements, and roadmap

---

## 🛠️ Tech Stack

- **Framework**: Next.js 16 (App Router) + React 19 + TypeScript
- **UI**: Tailwind CSS + shadcn/ui + Radix UI
- **Security**: Web Crypto API (`crypto.getRandomValues()`)
- **Build**: pnpm

---

## 🌍 Supported Languages

### Ukrainian
- Wordlist (10,000 words)
- Small Diceware (1,296 words, 4 dice)
- Normal Diceware (7,776 words, 5 dice)
- Large Diceware (46,656 words, 6 dice)

_All with English transliteration support_

The Ukrainian dictionaries and Diceware wordlists were developed by the same author in another repository, [diceware-ua](https://github.com/git-leaf/diceware-ua), which holds the source CSV and TXT files (and tooling used to build them). This app bundles copies under `public/wordlists/uk/`.

### English
- Original Diceware (7,776 words)
- EFF Short List (1,296 words)
- EFF Large List (7,776 words)
- Beale List (7,776 words)

---

## 🤝 Contributing

Contributions are welcome! While contribution guidelines are still being established, feel free to:

- 💡 Submit proposals and ideas via [GitHub Issues](https://github.com/git-leaf/passphrase-ua/issues)
- 🐛 Report bugs
- 📖 Improve documentation
- 🌐 Suggest new wordlists or languages

Please communicate with the maintainer before starting major changes.

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

All password generation occurs entirely in your browser using cryptographically secure random number generation. No passwords are ever stored, logged, or transmitted to any server. For maximum security, you can verify this by inspecting the network activity in your browser's developer tools.

---

**Made with 🇺🇦 for privacy-conscious users worldwide**
