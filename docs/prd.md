# Product Requirements Document: Passphrase UA

**Version:** 1.0  
**Last Updated:** November 8, 2025  
**Status:** Draft

---

## 1. Executive Summary

**Passphrase UA** is a client-side password and passphrase generator with first-class support for Ukrainian language dictionaries. The project aims to fill the gap in Ukrainian-language Diceware implementations while providing a secure, privacy-focused, and user-friendly tool for generating strong passwords and passphrases across multiple languages.

### Vision
To become the go-to passphrase generation tool for Ukrainian-speaking users while demonstrating the first comprehensive Ukrainian Diceware dictionaries, and serving as a flexible, multilingual password generation platform for privacy-conscious users worldwide.

### Primary Goals
1. Provide secure, client-side password/passphrase generation
2. Introduce and showcase Ukrainian Diceware dictionaries (small, normal, large)
3. Support multiple generation methods with extensible architecture
4. Ensure complete offline functionality and privacy

---

## 2. Background & Context

### Problem Statement
The [Diceware method](https://theworld.com/~reinhold/diceware.html) for generating memorable yet cryptographically strong passphrases exists in 29+ languages, but Ukrainian support is missing. Users need:
- Strong, memorable passphrases in their native language
- Transparent, trustworthy generation methods
- Client-side security guarantees
- Multiple generation methods for different use cases

### Inspiration
After learning about the Diceware method created by Arnold G. Reinhold, we noticed the lack of Ukrainian dictionary support. We set out to build comprehensive Ukrainian Diceware dictionaries and develop a modern web application to showcase and utilize them.

### Key Differentiators
- **First Ukrainian Diceware implementation** with 3+ dictionaries of different sizes
- **Completely client-side** — no server-side generation or data transmission
- **Modern, accessible UI** built with Next.js and shadcn/ui
- **Extensible architecture** for adding new generation methods and languages
- **Full offline support** with PWA capabilities (future version)

---

## 3. Target Users

### Primary Audience
1. **Privacy-conscious individuals** — Users who need strong passphrases for encryption, password managers, cryptocurrency wallets, etc.
2. **Ukrainian speakers** — Native Ukrainian users seeking security tools in their language
3. **General public** — Anyone needing quick, secure password generation
4. **Security professionals** — Users who understand and trust the Diceware method

### User Personas

**Persona 1: Olena (Privacy Advocate)**
- Age: 32, IT professional from Kyiv
- Needs: Strong passphrase for PGP key and password manager
- Pain points: Lack of Ukrainian security tools, distrust of online generators
- Goals: Generate memorable Ukrainian passphrase offline

**Persona 2: Mark (General User)**
- Age: 28, non-technical user
- Needs: Secure password for online accounts
- Pain points: Weak passwords, password reuse
- Goals: Quick, strong password generation with visual feedback

**Persona 3: Developer/Security Pro**
- Age: 35, security researcher
- Needs: Cryptographically sound generation, transparency
- Pain points: Closed-source generators, vendor lock-in
- Goals: Auditable code, multiple methods, extensibility

### Use Cases
- Generate passphrase for GPG/PGP encryption
- Create master password for password manager (1Password, ProtonPass, Bitwarden, KeePass)
- Secure cryptocurrency wallet seed phrases
- Wi-Fi WPA2/WPA3 passphrases
- Full-disk encryption passwords
- High-security account passwords
- Quick one-time passwords for temporary accounts

---

## 4. Product Scope

### In Scope (MVP)

#### Generation Methods
1. **Random Characters (Password)**
   - Configurable length (8-128 characters)
   - Character set options: lowercase, uppercase, numbers, symbols
   - Custom symbol sets
   - Exclude ambiguous characters option (O/0, l/1, etc.)

2. **Diceware (Passphrase)**
   - Word-based passphrase generation
   - Multiple language support (initially English & Ukrainian)
   - Configurable word count (4-12 words recommended)
   - Separator options (space, dash, underscore, none, custom)
   - Capitalization options
   - Digit/symbol insertion options

#### Ukrainian Diceware Dictionaries
- **Small** (4 dice, 1,296 words)
- **Normal** (5 dice, 7,776 words)
- **Large** (6 dice, 46,656 words)

#### English Diceware Dictionaries
- **Original Diceware** (5 dice, 7,776 words)
- **EFF Short List** (4 dice, 1,296 words)
- **EFF Long List** (5 dice, 7,776 words)
- **Beale List** (5 dice, 7,776 words)

#### Security Features
- **100% client-side generation** — No network requests during generation
- **Cryptographically secure RNG** — Use `window.crypto.getRandomValues()`
- **No analytics or tracking** — Complete privacy
- **No data persistence** — Passwords never saved (except explicit user action)
- **Content Security Policy** — Strict CSP headers
- **Open source** — Auditable code

#### User Experience
- **Strength Meter** with multiple indicators:
  - Entropy (bits)
  - Possible combinations
  - Time to crack (average, maximum)
  - Estimated cost to crack (if applicable)
- **One-click copy** — Copy to clipboard with visual feedback
- **Regenerate** — Quick regeneration with same settings
- **Theme support** — Light and dark modes
- **Responsive design** — Mobile-first, works on all screen sizes
- **Accessibility** — WCAG 2.1 AA compliance
- **Keyboard navigation** — Full keyboard support

#### Technical Requirements
- **Offline-first** — Must work without network connection
- **Fast load time** — Initial load < 2 seconds on 3G
- **Service Worker** — Cache dictionaries and assets
- **No external dependencies at runtime** — Self-contained bundles
- **TypeScript** — Fully typed codebase
- **Testing** — Unit tests for all generation logic

### Out of Scope (Future Phases)

#### Phase 2 (Post-MVP)
- Progressive Web App (PWA) with install prompt
- Additional languages (TODO: need to decide)
- Additional generation methods:
  - Memorable password (pronounceable)
  - Bitcoin BIP39 mnemonic
  - Custom dictionary upload
  - Passphrase with manual dice rolls
- Password history (local storage, encrypted)
- Batch generation
- Export options (CSV, JSON, encrypted file)

#### Phase 3 (Long-term)
- Browser extension
- Mobile apps (iOS, Android)
- CLI tool
- API for developers
- Password strength checker (separate tool)
- Community-contributed dictionaries

### Explicitly Excluded
- Server-side generation
- User accounts or authentication
- Cloud sync
- Third-party analytics
- Advertisements
- Paywalls or premium features

---

## 5. Technical Architecture

### Tech Stack

#### Frontend Framework
- **Next.js 16** with App Router
- **TypeScript** (strict mode)
- **React 19**

#### UI/Styling
- **Tailwind CSS** — Utility-first styling
- **shadcn/ui** — Component library built on Radix UI
- **Radix UI** — Accessible primitives
- **Lucide Icons** — Icon library

#### Security & Cryptography
- **Web Crypto API** (`crypto.getRandomValues()`) — Primary RNG (sufficient for MVP, built-in browser API, zero dependencies)
- **zod** — Input validation and schema validation
- **No custom crypto** — Use platform/battle-tested libraries only

#### State Management
- **React hooks** (`useState`, `useReducer`) for local state
- **Context API** for theme and settings
- **No global state library** initially (keep it simple)

#### Build & Tooling
- **pnpm** — Package manager
- **ESLint + Prettier** — Code quality
- **Vitest** — Unit testing (faster, better Vite/Next.js integration)
- **TypeScript strict mode** — Type safety

#### Deployment
- **Vercel**
- **Static export** if possible for maximum portability
- **Service Worker** for offline support
- **Content Security Policy (CSP)** headers configured

### Architecture Principles

#### Code Organization
```
app/
├── components/
│   ├── generator/           # Generation UI components
│   │   ├── method-selector.tsx
│   │   ├── options-panel.tsx
│   │   ├── output-display.tsx
│   │   └── strength-meter.tsx
│   ├── ui/                  # shadcn/ui components
│   └── layout/              # Layout components
├── lib/
│   ├── generators/          # Generation logic (pure functions)
│   │   ├── random-chars.ts
│   │   ├── diceware.ts
│   │   └── utils.ts
│   ├── dictionaries/        # Dictionary loaders
│   │   ├── loader.ts
│   │   └── types.ts
│   ├── entropy/             # Entropy calculation
│   │   └── calculator.ts
│   └── utils.ts
├── public/
│   └── dictionaries/        # Static dictionary files
│       ├── en/              # English dictionaries
│       │   ├── diceware.txt     # Original Diceware (7,776 words)
│       │   ├── eff-short.txt    # EFF Short (1,296 words)
│       │   ├── eff-long.txt     # EFF Long (7,776 words)
│       │   └── beale.txt        # Beale (7,776 words)
│       └── uk/              # Ukrainian dictionaries
│           ├── dictionary.txt   # Dictionary (10,000 words)
│           ├── small.txt        # Small Diceware (1,296 words)
│           ├── normal.txt       # Normal Diceware (7,776 words)
│           └── large.txt        # Large Diceware (46,656 words)
├── docs/                    # Documentation
│   ├── prd.md
│   ├── architecture.md
│   └── diceware-method.md
└── tests/                   # Test files
```

#### Generator Architecture
```typescript
// Pure, testable, composable functions
interface GeneratorConfig {
  method: 'random' | 'diceware';
  // Method-specific options
}

interface GeneratorResult {
  password: string;
  entropy: number;
  metadata: {
    method: string;
    timestamp: number;
    // Method-specific metadata
  };
}

type Generator = (config: GeneratorConfig) => GeneratorResult;
```

**Key Principles:**
- **Pure functions** for all generation logic
- **Separation of concerns** — generation logic separate from UI
- **Composability** — Easy to add new methods
- **Testability** — All logic unit testable
- **Type safety** — Leverage TypeScript for correctness

#### Security Considerations
1. **RNG Source**: Use `window.crypto.getRandomValues()` exclusively
2. **No server calls**: All generation client-side, verifiable in dev tools
3. **No persistence**: Passwords never stored (unless user explicitly copies)
4. **CSP Headers**: Prevent XSS and code injection
5. **Subresource Integrity**: If using CDN (avoid if possible)
6. **Regular audits**: Security review of generation code

---

## 6. Functional Requirements

### FR-1: Random Character Password Generation
**Priority:** P0 (MVP)

- **FR-1.1** User can select character length (8-128, default: 16)
- **FR-1.2** User can toggle character types:
  - Lowercase letters (a-z)
  - Uppercase letters (A-Z)
  - Numbers (0-9)
  - Symbols (!@#$%^&*...)
- **FR-1.3** User can exclude ambiguous characters (0/O, 1/l/I, etc.)
- **FR-1.4** User can specify custom symbol set
- **FR-1.5** At least one character type must be selected
- **FR-1.6** Generated password displays in monospace font
- **FR-1.7** Entropy calculated based on character set size and password length
- **FR-1.8** Human-readable evaluation of the password strength (weak/moderate/strong/very strong)

### FR-2: Diceware Passphrase Generation
**Priority:** P0 (MVP)

- **FR-2.1** User can select language: Ukrainian or English
- **FR-2.2** User can select dictionary:
  - **Ukrainian**: Small (4 dice), Normal (5 dice), Large (6 dice)
  - **English**: Original Diceware (5 dice), EFF Short List (4 dice), EFF Long List (5 dice), Beale List (5 dice)
- **FR-2.3** For Ukrainian dictionaries, user can choose to use transliteration or not (слово -> slovo)
- **FR-2.4** User can select word count (4-12, default: 6)
- **FR-2.5** User can select separator: space, dash, underscore, none, custom
- **FR-2.6** User can toggle capitalization:
  - None (all lowercase, default)
  - First letter of each word
  - Random letter per word
  - All uppercase
  - All letters uppercase of a random word 
- **FR-2.7** User can insert random digit/symbol between words
- **FR-2.8** Dictionary loads asynchronously with loading state
- **FR-2.9** Entropy calculated based on dictionary size and word count

### FR-3: Strength Meter
**Priority:** P0 (MVP)

- **FR-3.1** Display entropy in bits
- **FR-3.2** Display number of possible combinations (scientific notation)
- **FR-3.3** Display time to crack estimates:
  - Online attack (1k attempts/sec)
  - Offline attack (100B attempts/sec)
  - Custom (user can specify the number of attempts per second)
  - Display in human-readable format (seconds, years, centuries)
- **FR-3.4** Human-readable evaluation of the password strength (weak/moderate/strong/very strong)
- **FR-3.5** Color-coded display (red/yellow/green)
- **FR-3.6** Display cost to crack estimation:
  - Custom (user can specify the cost to crack in USD)

### FR-4: User Actions
**Priority:** P0 (MVP)

- **FR-4.1** "Generate" button triggers generation
- **FR-4.2** "Copy" button copies to clipboard
- **FR-4.3** Copy success feedback (toast notification)
- **FR-4.4** "Regenerate" button with same settings
- **FR-4.5** Keyboard shortcut for generate (Ctrl/Cmd + Enter)
- **FR-4.6** Keyboard shortcut for copy (Ctrl/Cmd + C when output focused)

### FR-5: Offline Support
**Priority:** P0 (MVP)

- **FR-5.1** All generation works without network
- **FR-5.2** Service Worker caches dictionaries
- **FR-5.3** Service Worker caches app shell
- **FR-5.4** Offline indicator in UI
- **FR-5.5** Graceful handling of missing dictionaries

### FR-6: Theme Support
**Priority:** P0 (MVP)

- **FR-6.1** Light mode (default)
- **FR-6.2** Dark mode
- **FR-6.3** System preference detection
- **FR-6.4** Theme toggle in UI
- **FR-6.5** Theme preference persisted in localStorage

### FR-7: Settings Persistence
**Priority:** P1 (Nice to have)

- **FR-7.1** Last used method saved to localStorage
- **FR-7.2** Last used options saved per method
- **FR-7.3** Privacy notice: "No passwords are ever saved"

---

## 7. Non-Functional Requirements

### NFR-1: Security
**Priority:** P0

- **NFR-1.1** All password generation uses `window.crypto.getRandomValues()`
- **NFR-1.2** No network requests during generation (verifiable in dev tools)
- **NFR-1.3** No passwords logged to console (even in dev mode)
- **NFR-1.4** No passwords in error reporting
- **NFR-1.5** Strict Content Security Policy headers
- **NFR-1.6** HTTPS only (HSTS enabled)
- **NFR-1.7** No third-party scripts or tracking
- **NFR-1.8** OWASP Top 10 compliance
- **NFR-1.9** Regular security audits of generation code

### NFR-2: Privacy
**Priority:** P0

- **NFR-2.1** GDPR compliant (no personal data collected)
- **NFR-2.2** No analytics or telemetry
- **NFR-2.3** No cookies (except functional localStorage for settings)
- **NFR-2.4** No external API calls
- **NFR-2.5** Privacy policy clearly states data practices
- **NFR-2.6** Open source for auditability

### NFR-3: Performance
**Priority:** P0

- **NFR-3.1** Initial page load < 2 seconds (3G connection)
- **NFR-3.2** Time to Interactive (TTI) < 3 seconds
- **NFR-3.3** Generation completes in < 100ms (99th percentile)
- **NFR-3.4** Lighthouse score > 90 across all metrics
- **NFR-3.5** Dictionary loading non-blocking
- **NFR-3.6** Bundle size < 500KB (initial, gzipped)

### NFR-4: Accessibility
**Priority:** P0

- **NFR-4.1** WCAG 2.1 Level AA compliance
- **NFR-4.2** Keyboard navigation for all features
- **NFR-4.3** Screen reader support
- **NFR-4.4** Focus indicators visible
- **NFR-4.5** Color contrast ratio ≥ 4.5:1
- **NFR-4.6** Semantic HTML
- **NFR-4.7** ARIA labels where needed

### NFR-5: Browser Compatibility
**Priority:** P0

- **NFR-5.1** Support last 2 versions of major browsers:
  - Chrome/Edge (Chromium)
  - Firefox
  - Safari
- **NFR-5.2** Graceful degradation for older browsers
- **NFR-5.3** Feature detection for Web Crypto API
- **NFR-5.4** Polyfill-free if possible

### NFR-6: Maintainability
**Priority:** P0

- **NFR-6.1** TypeScript strict mode, no `any` types
- **NFR-6.2** ESLint + Prettier configured
- **NFR-6.3** Unit test coverage > 80% for generation logic
- **NFR-6.4** Clear code comments for complex logic
- **NFR-6.5** README with setup instructions
- **NFR-6.6** Architecture documentation
- **NFR-6.7** Contribution guidelines

### NFR-7: Extensibility
**Priority:** P1

- **NFR-7.1** Plugin architecture for new generation methods
- **NFR-7.2** Dictionary loader supports new languages/formats
- **NFR-7.3** UI components decoupled from generation logic
- **NFR-7.4** Configuration schema validated with Zod

---

## 8. User Interface & Experience

### UI Principles
1. **Simplicity first** — One-click generation, minimal configuration
2. **Progressive disclosure** — Advanced options hidden by default
3. **Immediate feedback** — Real-time strength meter, instant copy confirmation
4. **Trust through transparency** — Clear explanation of methods, open source
5. **Accessibility** — Keyboard-first, screen reader friendly

### Information Architecture

```
Homepage / Generator
├── Method Selector (tabs or radio)
│   ├── Random Password
│   └── Diceware Passphrase
├── Configuration Panel (method-specific)
│   ├── Primary options (visible)
│   └── Advanced options (collapsible accordion — keeps context, progressive disclosure)
├── Generated Output
│   ├── Password/passphrase display
│   ├── Copy button
│   └── Regenerate button
├── Strength Meter
│   ├── Visual indicator
│   ├── Entropy
│   ├── Combinations
│   └── Time to crack
└── Footer
    ├── About/FAQ link
    ├── GitHub link
    ├── Privacy policy
    └── Theme toggle
```

### Key Screens

#### 1. Generator (Main Screen)
- Prominent method selector at top
- Configuration panel below with primary options visible
- Advanced options in collapsible accordion (no modal interruption)
- Large "Generate" button
- Output display with copy/regenerate actions
- Strength meter integrated into output section
- Clean, uncluttered layout

#### 2. About/FAQ Page
- Explanation of Diceware method (link to [original](https://theworld.com/~reinhold/diceware.html))
- Why Ukrainian dictionaries matter
- How the generator works (security, privacy)
- Links to source code
- Credits and acknowledgments

#### 3. Privacy Policy Page
- Clear statement: "No data collected, ever"
- Explanation of localStorage usage (settings only)
- GDPR compliance statement
- Contact information

### Copy & Messaging

#### Primary CTA
- "Generate Secure Password" (Random method)
- "Generate Passphrase" (Diceware method)

#### Strength Meter Labels
- 0-40 bits: "Weak" (red)
- 41-60 bits: "Moderate" (yellow)
- 61-80 bits: "Strong" (light green)
- 81+ bits: "Very Strong" (dark green)

#### Help Text Examples
- Diceware: "Generates memorable passphrase using random words from a dictionary. Recommended for master passwords."
- Random: "Generates completely random password. Strong but harder to remember."
- Entropy: "Higher entropy = more secure. 60+ bits recommended for most uses, 80+ for high-security."

#### Copy Success Message
- Toast: "Copied to clipboard!"
- Accessible announcement for screen readers

---

## 9. Success Metrics

### MVP Success Criteria
1. **Functional completeness**: All P0 requirements implemented
2. **Security audit**: Independent review of RNG and generation logic
3. **Performance**: All NFR-3 targets met
4. **Accessibility**: WCAG AA compliance verified
5. **User testing**: 10+ users successfully generate passwords

### Post-Launch Metrics (Optional, Privacy-Preserving)
If any analytics are added (with user consent), track:
- Page load time (RUM)
- Generation method usage distribution
- Error rates
- Browser/OS distribution (for compatibility)

**Note**: All analytics must be:
- Opt-in
- Privacy-preserving (no fingerprinting)
- Self-hosted (e.g., Plausible, Umami)
- Open about data collection

### Long-Term Success Indicators
1. GitHub stars/forks (community interest)
2. Community-contributed dictionaries
3. Ukrainian dictionary adoption by other tools
4. Contributions and pull requests
5. Mentions in security communities

---

## 10. Security & Privacy

### Threat Model

#### Assets to Protect
- Generated passwords/passphrases (primary)
- User privacy (no tracking)
- Code integrity (no tampering)

#### Threats
1. **Weak RNG**: Predictable password generation
   - **Mitigation**: Use only `crypto.getRandomValues()`
2. **XSS Attack**: Injection of malicious code
   - **Mitigation**: Strict CSP, React's built-in XSS protection, input validation
3. **Man-in-the-Middle**: Interception of passwords
   - **Mitigation**: HTTPS only, HSTS, no network transmission of passwords
4. **Clipboard Sniffing**: Malicious apps reading clipboard
   - **Mitigation**: User awareness (can't prevent), optional manual copy
5. **Supply Chain Attack**: Compromised dependencies
   - **Mitigation**: Minimal dependencies, SRI, regular audits, lock files
6. **Side-Channel Attacks**: Timing attacks on generation
   - **Mitigation**: Constant-time operations where possible, not a primary concern for this use case

#### Assumptions
- User's device is not compromised
- User's browser is up-to-date
- User will store generated password securely (outside our control)

### Security Best Practices

#### Random Number Generation
```typescript
// GOOD: Use Web Crypto API
const array = new Uint32Array(10);
window.crypto.getRandomValues(array);

// BAD: Never use Math.random()
// const random = Math.random(); // ❌ NOT CRYPTOGRAPHICALLY SECURE
```

#### No Sensitive Data Logging
```typescript
// GOOD: Log events, not data
console.log('Password generated with method: diceware');

// BAD: Never log passwords
// console.log('Generated password:', password); // ❌ NEVER DO THIS
```

#### Content Security Policy
```
Content-Security-Policy: 
  default-src 'self'; 
  script-src 'self'; 
  style-src 'self' 'unsafe-inline'; 
  img-src 'self' data:; 
  font-src 'self'; 
  connect-src 'self'; 
  frame-ancestors 'none'; 
  base-uri 'self'; 
  form-action 'self';
```

### Privacy Considerations

#### What We DON'T Collect
- No passwords or generated output
- No user accounts or emails
- No IP addresses
- No usage analytics (unless opt-in, privacy-preserving)
- No cookies (except localStorage for settings)
- No device fingerprinting

#### What We MAY Store (LocalStorage Only)
- Theme preference (light/dark)
- Last used generator method
- Last used configuration options
- No passwords, ever

#### GDPR Compliance
- No personal data collected → no GDPR concerns
- Privacy policy clearly states practices
- No cookie banner needed (no tracking cookies)
- User has full control (can clear localStorage anytime)

### Audit & Transparency
- **Open source**: Code available on GitHub for review
- **Documentation**: Clear explanation of security measures
- **Reproducible builds**: Users can verify deployed version matches source
- **Security.txt**: Provide vulnerability disclosure policy

---

## 11. Dictionaries

### Ukrainian Dictionaries (Original Contribution)

All Ukrainian dictionaries include **transliteration support** to enable easier typing on non-Ukrainian keyboards.

#### Dictionary (10,000 words)
- **Format**: `WORD TRANSLITERATION`
- **File format**: Dictionary with Transliteration
- **Use case**: Non-Diceware generation methods, custom passphrases
- **Selection criteria**:
  - Comprehensive vocabulary coverage
  - Common and frequently used words
  - Diverse parts of speech (nouns, verbs, adjectives)
  - Cultural relevance to Ukraine
  - Easy to spell and type
  - No offensive or easily confused words

#### Small Diceware Dictionary (4 dice, 1,296 words)
- **Format**: `INDEX WORD TRANSLITERATION`
- **File format**: Diceware Dictionary with Transliteration
- **Dice range**: 1111-6666
- **Use case**: Shorter passphrases (6-8 words for 60-80 bits entropy)
- **Selection criteria**:
  - Most common Ukrainian words
  - Easy to remember and type
  - High frequency in everyday usage
  - Subset of larger dictionaries
  - No offensive or easily confused words

#### Normal Diceware Dictionary (5 dice, 7,776 words)
- **Format**: `INDEX WORD TRANSLITERATION`
- **File format**: Diceware Dictionary with Transliteration
- **Dice range**: 11111-66666
- **Use case**: Standard passphrases (5-6 words for 65-77 bits entropy)
- **Selection criteria**:
  - Balance of common and less common words
  - Diverse parts of speech
  - Cultural relevance to Ukraine
  - Includes words from Small dictionary
  - Suitable for most security needs

#### Large Diceware Dictionary (6 dice, 46,656 words)
- **Format**: `INDEX WORD TRANSLITERATION`
- **File format**: Diceware Dictionary with Transliteration
- **Dice range**: 111111-666666
- **Use case**: Longer passphrases with fewer words (4-5 words for 62-78 bits entropy)
- **Selection criteria**:
  - Comprehensive word list (maximum vocabulary)
  - Technical terms, place names, specialized vocabulary
  - Includes all words from Normal dictionary
  - Maximum entropy per word
  - Cultural and linguistic diversity

### English Dictionaries (Existing)

English dictionaries use standard formats without transliteration.

#### Original Diceware Dictionary
- **Format**: `INDEX WORD`
- **File format**: Diceware Dictionary
- **Source**: https://theworld.com/~reinhold/diceware.html
- **Size**: 7,776 words (5 dice)
- **Dice range**: 11111-66666
- **License**: Creative Commons CC-BY 3.0
- **Use case**: Standard passphrases (5-6 words for 65-77 bits entropy)
- **Notes**: Original, time-tested list with short words (avg 4.2 characters), created by Arnold G. Reinhold

#### EFF Short Diceware Dictionary
- **Format**: `INDEX WORD`
- **File format**: Diceware Dictionary
- **Source**: https://www.eff.org/dice
- **Size**: 1,296 words (4 dice)
- **Dice range**: 1111-6666
- **License**: Creative Commons CC-BY 3.0
- **Use case**: Shorter passphrases (6-8 words for 60-80 bits entropy)
- **Notes**: Short, memorable words, no offensive content

#### EFF Long Diceware Dictionary
- **Format**: `INDEX WORD`
- **File format**: Diceware Dictionary
- **Source**: https://www.eff.org/dice
- **Size**: 7,776 words (5 dice)
- **Dice range**: 11111-66666
- **License**: Creative Commons CC-BY 3.0
- **Use case**: Standard passphrases (5-6 words for 65-77 bits entropy)
- **Notes**: Longer, more memorable words (avg 7.0 characters), no offensive content

#### Beale Diceware Dictionary
- **Format**: `INDEX WORD`
- **File format**: Diceware Dictionary
- **Source**: https://theworld.com/~reinhold/beale.wordlist.asc
- **Size**: 7,776 words (5 dice)
- **Dice range**: 11111-66666
- **License**: Public Domain (compiled by Alan Beale)
- **Use case**: Standard passphrases (5-6 words for 65-77 bits entropy)
- **Notes**: Fewer Americanisms and obscure words, alternative to Original Diceware, edited by Alan Beale

---

### Dictionary Management

> **Note:** All dictionary files are stored in `public/dictionaries/` organized by language (`en/`, `uk/`).  
> See Section 5 (Technical Architecture → Code Organization) for the complete directory structure.

#### Dictionary File Formats

The application supports **4 dictionary file formats** based on two main structures (Dictionary and Diceware Dictionary), each with an optional transliteration variant.

##### General Format Rules

**Comments and Metadata:**
- Comments start with `#` and are optional but highly recommended
- Comments do not influence execution, only provide metadata
- Recommended metadata fields:
  - `Name`: Dictionary name (e.g., "English Diceware")
  - `Format`: Column structure (e.g., "WORD", "WORD TRANSLITERATION", "INDEX WORD", "INDEX WORD TRANSLITERATION")
  - `Language`: ISO language code (e.g., "en", "uk")
  - `Transliteration`: Transliteration language if present (e.g., "en")
  - `Dice`: Number of dice if Diceware format (e.g., "5")
  - `Size`: Total number of words (e.g., "7776")

**Word Order:**
- All words must be in **alphabetical order** (by word, not dice number)
- For Diceware formats, dice numbers correspond to alphabetical position

---

##### 1. Dictionary

Simple word list with one word per line in alphabetical order. Used for non-Diceware generation methods.

```
# Name: English Dictionary
# Format: WORD
# Language: en
# Size: 10000

aardvark
ability
about
...
zulu
```

**Specifications:**
- One word per line
- Words in alphabetical order
- No dice numbers or additional columns

---

##### 2. Dictionary with Transliteration

Word list with transliteration support. Each line contains a word and its transliteration.

```
# Name: Ukrainian Dictionary with Transliteration
# Format: WORD TRANSLITERATION
# Language: uk
# Transliteration: en
# Size: 10000

абетка abetka
вікно vikno
гора hora
...
яблуко yabluko
```

**Specifications:**
- One word per line with transliteration
- Format: `WORD<space>TRANSLITERATION`
- Words in alphabetical order (by original word)
- Single space separator between word and transliteration
- Transliteration typically follows standard romanization rules

---

##### 3. Diceware Dictionary

Diceware word list with dice numbers as keys. Each line contains a dice number and a word.

```
# Name: English Diceware Dictionary
# Format: INDEX WORD
# Language: en
# Dice: 5
# Size: 7776

11111 a
11112 aardvark
11113 ability
...
66666 zulu
```

**Specifications:**
- Format: `DICE_NUMBER<space>WORD`
- Dice number: 4, 5, or 6 digits (depending on dictionary size)
  - 4 dice = 1,296 words (1111-6666)
  - 5 dice = 7,776 words (11111-66666)
  - 6 dice = 46,656 words (111111-666666)
- Each digit must be 1-6
- Single space separator between dice number and word
- Words in alphabetical order

---

##### 4. Diceware Dictionary with Transliteration

Diceware word list with transliteration support. Each line contains a dice number, word, and transliteration.

```
# Name: Ukrainian Diceware Dictionary with Transliteration
# Format: INDEX WORD TRANSLITERATION
# Language: uk
# Transliteration: en
# Dice: 5
# Size: 7776

11111 абетка abetka
11112 вікно vikno
11113 гора hora
...
66666 яблуко yabluko
```

**Specifications:**
- Format: `DICE_NUMBER<space>WORD<space>TRANSLITERATION`
- Same dice number rules as Diceware Dictionary format
- Single space separator between each column
- Words in alphabetical order (by original word)
- Transliteration typically follows standard romanization rules

#### Loading Strategy
1. **Lazy loading**: Load dictionary only when method selected
2. **Caching**: Service Worker caches dictionaries
3. **Compression**: Serve as gzip/brotli compressed raw text (simpler, standard format, automatic server compression)
4. **Validation**: Verify dictionary format on load
5. **Error handling**: Graceful fallback if dictionary fails to load

#### Future Dictionary Additions
- TODO: Decide on the list of languages and dictionaries to add
- Community contributions welcome (with review process)

---

## 12. Roadmap

### Phase 0: Preparation (Current)
- ✅ Create PRD
- ⬜ Finalize Ukrainian dictionaries
- ⬜ Set up Next.js project structure
- ⬜ Iterate UI design in-browser with shadcn/ui (faster development cycle, leverage components, easier to test responsiveness)

### Phase 1: MVP (Target: 4-6 weeks)

**Week 1-2: Core Foundation**
- Set up Next.js + TypeScript + Tailwind + shadcn/ui
- Implement random password generator (pure function)
- Implement entropy calculator
- Write unit tests for generation logic
- Create basic UI layout

**Week 3-4: Diceware Implementation**
- Implement Diceware generator (pure function)
- Create dictionary loader
- Integrate Ukrainian dictionaries (all 3 sizes)
- Integrate English dictionaries (Original, EFF)
- Dictionary selection UI

**Week 5: Polish & Testing**
- Implement strength meter with all metrics
- Copy to clipboard functionality
- Theme support (light/dark)
- Accessibility audit and fixes
- Cross-browser testing
- Security review

**Week 6: Launch Preparation**
- Service Worker for offline support
- Documentation (README, FAQ)
- Privacy policy
- Deploy to Vercel
- Soft launch for testing

### Phase 2: Enhancements (Target: 2-3 months post-MVP)
- PWA capabilities (install prompt, app manifest)
- Additional generation methods:
  - Memorable passwords (pronounceable)
  - Custom dictionary upload
  - Manual dice roll mode (for paranoid users, full dictionary is displayed with word codes)
- Settings persistence improvements
- Performance optimizations
- Community feedback integration

### Phase 3: Expansion (Target: 6 months post-MVP)
- Additional language dictionaries
- Browser extension (Chrome, Firefox)
- Password strength checker (separate tool)
- API/CLI for developers
- Community dictionary contributions

### Ongoing
- Security audits (quarterly)
- Dependency updates
- Bug fixes
- Community support
- Documentation improvements

---

## 13. Open Questions & Decisions Needed

### Content Decisions
- [ ] **Ukrainian dictionary completion**: When will dictionaries be ready?
  - **Action**: Confirm timeline with dictionary creator
- [ ] **English dictionary licensing**: Verify we can redistribute
  - **Action**: Review licenses (CC-BY 4.0 confirmed for Original Diceware)

### Launch Decisions
- [ ] **Domain name**: passphrase.ua, diceware.ua, or other?
  - **Action**: Check availability and register
- [ ] **Announcement strategy**: Where to share (Reddit, Hacker News, Ukrainian tech communities)?
  - **Action**: Create launch plan

---

## 14. Success Criteria & Definition of Done

### MVP Launch Criteria
- [ ] All P0 functional requirements implemented
- [ ] All P0 non-functional requirements met
- [ ] Unit test coverage > 80% for generation logic
- [ ] Zero TypeScript errors or warnings
- [ ] Zero console errors in production
- [ ] WCAG AA accessibility compliance verified
- [ ] Cross-browser testing completed (Chrome, Firefox, Safari)
- [ ] Offline mode functional
- [ ] Security review completed (internal)
- [ ] Performance targets met (Lighthouse > 90)
- [ ] Documentation complete (README, FAQ, Privacy Policy)
- [ ] 10+ manual user tests with positive feedback

### Definition of Done (Per Feature)
- [ ] Code written in TypeScript (strict mode)
- [ ] Unit tests written and passing
- [ ] Accessible (keyboard + screen reader tested)
- [ ] Responsive (tested on mobile, tablet, desktop)
- [ ] Code reviewed (if team grows)
- [ ] Documentation updated
- [ ] No linter errors

---

## 15. Resources & References

### Diceware Method
- **Original Diceware**: https://theworld.com/~reinhold/diceware.html
- **Diceware FAQ**: https://theworld.com/~reinhold/dicewarefaq.html
- **Interactive demo**: https://diceware.dmuth.org/
- **EFF Dice-Generated Passphrases**: https://www.eff.org/dice

### Security Standards
- **OWASP**: https://owasp.org/www-project-web-security-testing-guide/
- **NIST SP 800-63B** (Digital Identity Guidelines): https://pages.nist.gov/800-63-3/sp800-63b.html
- **Web Crypto API**: https://developer.mozilla.org/en-US/docs/Web/API/Web_Crypto_API

### Privacy & Compliance
- **GDPR**: https://gdpr.eu/
- **Privacy by Design**: https://www.ipc.on.ca/privacy-by-design/

### Technical Documentation
- **Next.js Docs**: https://nextjs.org/docs
- **shadcn/ui**: https://ui.shadcn.com/
- **Radix UI**: https://www.radix-ui.com/
- **Tailwind CSS**: https://tailwindcss.com/docs

### Similar Projects (Inspiration)
- **StrongPhrase**: https://strongphrase.net/ - Open-source passphrase generator focused on memorable, secure passphrases
- **Diceware (Dmuth)**: https://diceware.dmuth.org/ - Interactive Diceware passphrase generator with good UX
- **1Password Password Generator**: https://1password.com/password-generator/ - Commercial password manager with web generator
- **Proton Pass**: https://proton.me/pass/password-generator - Privacy-focused password manager with generator

---

## 16. Glossary

### Security & Cryptography Terms
- **Diceware**: A method for creating passphrases using dice and a word list, invented by Arnold G. Reinhold
- **Entropy**: A measure of password strength in bits; higher entropy means more secure (e.g., 77 bits is very strong)
- **Passphrase**: A password composed of multiple words, typically longer and more memorable than random characters
- **RNG**: Random Number Generator
- **CSPRNG**: Cryptographically Secure Pseudo-Random Number Generator
- **Web Crypto API**: Browser API for cryptographic operations including `crypto.getRandomValues()`

### Web Technologies
- **PWA**: Progressive Web App - web application that can work offline and be installed like a native app
- **Service Worker**: Background script that enables offline functionality and caching
- **CSP**: Content Security Policy - HTTP header that helps prevent XSS attacks
- **SRI**: Subresource Integrity - security feature that verifies external resources haven't been tampered with

### Accessibility & Compliance
- **WCAG**: Web Content Accessibility Guidelines - standards for making web content accessible
- **GDPR**: General Data Protection Regulation - EU law on data protection and privacy
- **OWASP**: Open Web Application Security Project - nonprofit focused on web application security

### Project-Specific Terms
- **Transliteration**: Conversion of text from one script to another (e.g., Ukrainian Cyrillic "слово" → Latin "slovo")
- **Dictionary**: Simple word list format, one word per line (optionally with transliteration)
- **Diceware Dictionary**: Word list with dice number indices for Diceware method (e.g., "11111 word")
- **Index**: Dice number prefix in Diceware format (4-6 digits, each 1-6, e.g., "11111" for "word")

---

## 17. Approval & Sign-off

**Document Author**: Passphrase UA Team  
**Stakeholders**: Project founder, contributors, Ukrainian security community  
**Review Status**: Draft  
**Next Review Date**: After MVP implementation

---

## Appendix A: Entropy Calculations

### Random Password Entropy
```
Entropy = log₂(charset_size ^ length)

Example: 16-character password with lowercase + uppercase + numbers + symbols
Charset size = 26 + 26 + 10 + 32 = 94
Entropy = log₂(94^16) ≈ 105 bits
```

### Diceware Entropy
```
Entropy = log₂(dictionary_size ^ word_count)

Ukrainian Small (1,296 words):
- 6 words: log₂(1,296^6) ≈ 61.8 bits
- 8 words: log₂(1,296^8) ≈ 82.4 bits

Ukrainian Normal (7,776 words):
- 5 words: log₂(7,776^5) ≈ 64.6 bits
- 6 words: log₂(7,776^6) ≈ 77.5 bits

Ukrainian Large (46,656 words):
- 4 words: log₂(46,656^4) ≈ 62.0 bits
- 5 words: log₂(46,656^5) ≈ 77.5 bits
```

### Time to Crack Estimates
Assumptions:
- Online attack: 1,000 attempts/second (throttled)
- Offline attack (leaked hash): 100 billion attempts/second (GPU cluster)

```
Time = (2^entropy / attempts_per_second) / 2  (average case)

60 bits entropy:
- Online: ~18 million years
- Offline: ~182 years

80 bits entropy:
- Online: ~19 trillion years
- Offline: ~192 million years
```

---

## Appendix B: Example User Flows

### Flow 1: Quick Password Generation
1. User lands on homepage
2. Random Password method selected by default
3. User clicks "Generate" (default settings: 16 chars, all types)
4. Password appears in output box
5. User clicks "Copy"
6. Success toast appears
7. User pastes into password field

**Time**: ~5 seconds

### Flow 2: Ukrainian Diceware Passphrase
1. User lands on homepage
2. User clicks "Diceware Passphrase" tab
3. User selects "Ukrainian" language
4. User selects "Normal (5 dice)" dictionary
5. User adjusts word count to 6
6. User clicks "Generate"
7. Passphrase appears: "хмара собака вікно книга ліхтар музика"
8. Strength meter shows: "77 bits, Very Strong"
9. User clicks "Copy"
10. User saves to password manager

**Time**: ~15 seconds

### Flow 3: Advanced Custom Password
1. User lands on homepage
2. Random Password selected
3. User expands "Advanced Options"
4. User sets length to 24
5. User unchecks "Symbols"
6. User checks "Exclude ambiguous characters"
7. User clicks "Generate"
8. Password appears
9. User reviews strength meter
10. User clicks "Regenerate" (wants different password)
11. New password appears
12. User clicks "Copy"

**Time**: ~30 seconds

### Flow 4: Ukrainian Diceware with Transliteration
1. User lands on homepage
2. User clicks "Diceware Passphrase" tab
3. User selects "Ukrainian" language
4. User selects "Small (4 dice)" dictionary
5. User enables "Use transliteration" toggle
6. User adjusts word count to 7
7. User clicks "Generate"
8. Passphrase displays in transliteration: "knyha vikno misto sontse derevo voda hroshi"
9. User hovers to see original Cyrillic: "книга вікно місто сонце дерево вода гроші"
10. Strength meter shows: "82 bits, Very Strong"
11. User clicks "Copy" (copies transliteration)
12. User can type passphrase on non-Ukrainian keyboard

**Time**: ~20 seconds  
**Use case**: Non-Ukrainian keyboard users, easier typing while maintaining Ukrainian words

---

## Revision History

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 1.0 | 2025-11-08 | Project Founder | Initial PRD creation based on project founder input |

---

**End of Product Requirements Document**

