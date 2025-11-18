/**
 * Translation dictionaries for English and Ukrainian
 */

export type Locale = "en" | "uk"

export interface Translations {
  // Header
  header: {
    title: string
    subtitle: string
  }

  // Tabs
  tabs: {
    password: string
    passphrase: string
    learn: string
  }

  // Password Options
  password: {
    length: string
    uppercase: string
    lowercase: string
    numbers: string
    symbols: string
    advancedOptions: string
    excludeAmbiguous: string
    excludeAmbiguousDetail: string
    generate: string
    generating: string
  }

  // Passphrase Options
  passphrase: {
    wordCount: string
    words: string
    sourceLanguage: string
    wordlist: string
    separator: string
    separatorSpace: string
    separatorDash: string
    separatorUnderscore: string
    separatorPeriod: string
    separatorNone: string
    separatorCustom: string
    customSeparator: string
    customSeparatorPlaceholder: string
    capitalization: string
    capNone: string
    capFirst: string
    capRandom: string
    capAll: string
    capRandomWord: string
    includeNumber: string
    useTransliteration: string
    advancedOptions: string
    generate: string
    generating: string
  }

  // Wordlist names
  wordlists: {
    en: {
      "eff-large": string
      "eff-short": string
      "eff-short-2": string
      "beale": string
      "original": string
    }
    uk: {
      wordlist: string
      "small-diceware": string
      "normal-diceware": string
      "large-diceware": string
    }
  }

  // Output Display
  output: {
    entropy: string
    bits: string
    combinations: string
    timeToCrack: string
    costToCrack: string
    avgTime: string
    maxTime: string
    strengthLabel: string
    strength: {
      weak: string
      moderate: string
      strong: string
      veryStrong: string
      excessive: string
    }
    copy: string
    copied: string
    regenerate: string
    regenerating: string
    configureMetrics: string
    guessRate: string
    costPer32: string
    enterGuessRate: string
    enterCost: string
    guessRateMillion: string
    guessRateBillion: string
    guessRateTrillion: string
    guessRateQuadrillion: string
    guessRateCustom: string
  }

  // Footer
  footer: {
    securityNotice: string
    supportUkraine: string
    supportDescription: string
    supportFundraising: string
    aboutProject: string
    sourceCode: string
    reportIssue: string
    documentation: string
    contact: string
    privacy: string
  }

  // Privacy Policy
  privacy: {
    title: string
    lastUpdated: string
    lastUpdatedDate: string
    overview: {
      title: string
      noDataMessage: string
      description: string
    }
    whatWeDontCollect: {
      title: string
      passwords: string
      accounts: string
      ipAddresses: string
      analytics: string
      fingerprints: string
      anyPersonalData: string
    }
    whatWeStoreLocally: {
      title: string
      description: string
      themePreference: string
      themeDescription: string
      languagePreference: string
      languageDescription: string
      noPasswords: string
      noPasswordsDescription: string
      clearSettings: string
    }
    howItWorks: {
      title: string
      clientSideGeneration: {
        title: string
        description: string
      }
      noNetworkRequests: {
        title: string
        description: string
      }
      openSource: {
        title: string
        description: string
      }
    }
    gdprCompliance: {
      title: string
      description: string
      noPersonalData: string
      noUserIdentifyingInfo: string
      noTrackingCookies: string
      userControl: string
      noDataToManage: string
    }
    security: {
      title: string
      description: string
      cryptoSecureRng: string
      strictCsp: string
      httpsWithHsts: string
      noThirdPartyScripts: string
      regularAudits: string
    }
    changesToPolicy: {
      title: string
      description: string
    }
    contact: {
      title: string
      description: string
      openIssueOn: string
      reviewSourceCode: string
    }
    backToGenerator: string
  }

  // Theme
  theme: {
    toggleTheme: string
    light: string
    dark: string
    system: string
  }

  // Toast messages
  toast: {
    copied: string
    copiedDescription: string
    error: string
    errorPassword: string
    errorPassphrase: string
  }

  // Learn content (section titles and key content)
  learn: {
    title: string
    gettingStarted: {
      title: string
      description: string
      randomTitle: string
      randomDescription: string
      randomExample: string
      dicewareTitle: string
      dicewareDescription: string
      dicewareExample: string
    }
    safety: {
      title: string
      point1: string
      point2: string
      point3: string
      point4: string
    }
    whenToUse: {
      title: string
      randomTitle: string
      randomList: string[]
      dicewareTitle: string
      dicewareList: string[]
    }
    strength: {
      title: string
      description: string
      guidelinesTitle: string
      weak: string
      moderate: string
      strong: string
      veryStrong: string
      excessive: string
      example: string
    }
    faq: {
      title: string
      q1: string
      a1: string[]
      q2: string
      a2Title: string
      a2List: string[]
      a2Footer: string
      q3: string
      a3: string[]
      q4: string
      a4: string[]
      q5: string
      a5: string
      q6: string
      a6: string
      q7: string
      a7GoodTitle: string
      a7GoodList: string[]
      a7BadTitle: string
      a7BadList: string[]
      q8: string
      a8: string[]
      q9: string
      a9: string[]
      a9Title: string
      a9List: string[]
    }
    comparison: {
      title: string
      feature: string
      randomPassword: string
      dicewarePassphrase: string
      memorability: string
      memorabilityRandom: string
      memorabilityDiceware: string
      typingSpeed: string
      typingSpeedRandom: string
      typingSpeedDiceware: string
      length: string
      lengthRandom: string
      lengthDiceware: string
      entropyPerChar: string
      entropyRandom: string
      entropyDiceware: string
      totalSecurity: string
      securityRandom: string
      securityDiceware: string
      bestFor: string
      bestForRandom: string
      bestForDiceware: string
    }
    bestPractices: {
      title: string
      list: string[]
    }
    whatIsDiceware: {
      title: string
      description1: string
      description2: string
      wordlistsTitle: string
      ukrainian: string
      english: string
    }
    similarTools: {
      title: string
      description: string
      dmuth: string
      dmuthDescription: string
      strongphrase: string
      strongphraseDescription: string
    }
    passwordManager: {
      title: string
      description: string
      bitwarden: string
      bitwardenDescription: string
      keepass: string
      keepassDescription: string
      proton: string
      protonDescription: string
      onepassword: string
      onepasswordDescription: string
    }
    resources: {
      title: string
      description: string
      eff: string
      effDescription: string
      original: string
      originalDescription: string
      xkcd: string
      xkcdDescription: string
      nist: string
      nistDescription: string
    }
  }
}

export const translations: Record<Locale, Translations> = {
  en: {
    header: {
      title: "Passphrase UA",
      subtitle: "Generate secure passwords and memorable passphrases",
    },

    tabs: {
      password: "Password",
      passphrase: "Passphrase",
      learn: "Learn",
    },

    password: {
      length: "Password Length",
      uppercase: "Uppercase (A-Z)",
      lowercase: "Lowercase (a-z)",
      numbers: "Numbers (0-9)",
      symbols: "Symbols (!@#$)",
      advancedOptions: "Advanced Options",
      excludeAmbiguous: "Exclude Ambiguous",
      excludeAmbiguousDetail: "(i, l, 1, L, o, 0, O)",
      generate: "Generate Password",
      generating: "Generating...",
    },

    passphrase: {
      wordCount: "Number of Words",
      words: "words",
      sourceLanguage: "Source Language",
      wordlist: "Wordlist",
      separator: "Separator",
      separatorSpace: "Space",
      separatorDash: "Dash",
      separatorUnderscore: "Underscore",
      separatorPeriod: "Period",
      separatorNone: "None",
      separatorCustom: "Custom",
      customSeparator: "Custom Separator",
      customSeparatorPlaceholder: "Enter custom separator",
      capitalization: "Capitalization",
      capNone: "None (all lowercase)",
      capFirst: "First letter of each word",
      capRandom: "Random letter per word",
      capAll: "All uppercase",
      capRandomWord: "Random word all uppercase",
      includeNumber: "Include number after words",
      useTransliteration: "Use transliteration (Latin characters)",
      advancedOptions: "Advanced Options",
      generate: "Generate Passphrase",
      generating: "Generating...",
    },

    wordlists: {
      en: {
        "eff-large": "EFF Large (7,776 words)",
        "eff-short": "EFF Short (1,296 words)",
        "eff-short-2": "EFF Short 2 (1,296 words)",
        "beale": "Beale (7,776 words)",
        "original": "Original Diceware (7,776 words)",
      },
      uk: {
        wordlist: "Wordlist (10,000 words)",
        "small-diceware": "Small Diceware (1,296 words)",
        "normal-diceware": "Normal Diceware (7,776 words)",
        "large-diceware": "Large Diceware (46,656 words)",
      },
    },

    output: {
      entropy: "Entropy",
      bits: "bits",
      combinations: "Combinations",
      timeToCrack: "Time to Crack",
      costToCrack: "Cost to Crack",
      avgTime: "avg",
      maxTime: "max",
      strengthLabel: "Strength",
      strength: {
        weak: "Weak",
        moderate: "Moderate",
        strong: "Strong",
        veryStrong: "Very Strong",
        excessive: "Excessive",
      },
      copy: "Copy",
      copied: "Copied!",
      regenerate: "Regenerate",
      regenerating: "Regenerating...",
      configureMetrics: "Configure Metrics",
      guessRate: "Guess Rate (guesses/sec)",
      costPer32: "Cost per 2^32 Guesses ($)",
      enterGuessRate: "Enter guesses per second",
      enterCost: "Enter cost per 2^32 guesses",
      guessRateMillion: "1 Million (10^6)",
      guessRateBillion: "1 Billion (10^9)",
      guessRateTrillion: "1 Trillion (10^12)",
      guessRateQuadrillion: "1 Quadrillion (10^15)",
      guessRateCustom: "Custom",
    },

    footer: {
      securityNotice:
        "All passwords are generated locally in your browser. Nothing is stored or transmitted. You can use it offline.",
      supportUkraine: "Support Ukraine 🇺🇦",
      supportDescription:
        "Consider supporting Ukrainian humanitarian and defense efforts through trusted organizations.",
      supportFundraising: "Or support our current fundraising:",
      aboutProject: "About Project",
      sourceCode: "Source Code",
      reportIssue: "Report Issue",
      documentation: "Documentation",
      contact: "Contact",
      privacy: "Privacy",
    },

    theme: {
      toggleTheme: "Toggle theme",
      light: "Light",
      dark: "Dark",
      system: "System",
    },

    toast: {
      copied: "Copied!",
      copiedDescription: "Password copied to clipboard",
      error: "Error",
      errorPassword: "Failed to generate password",
      errorPassphrase: "Failed to generate passphrase",
    },

    learn: {
      title: "Password Security Guide",
      gettingStarted: {
        title: "Getting Started",
        description:
          "Strong passwords protect your digital life. This tool helps you create two types of secure passwords:",
        randomTitle: "🔐 Random Passwords",
        randomDescription:
          "Mix of letters, numbers, and symbols. Very secure but harder to remember. Perfect for accounts stored in a password manager.",
        randomExample: "K9#mP2@xL5qR",
        dicewareTitle: "💬 Diceware Passphrases",
        dicewareDescription:
          "Random words combined together. Easy to remember and type while staying secure. Great for a master password for your password manager. Also great for other passwords you need to remember and type manually.",
        dicewareExample: "correct-horse-battery-staple",
      },
      safety: {
        title: "Why This Tool is Safe",
        point1: "✓ Everything happens in your browser. No passwords are sent over the network (once the page is loaded, you can use it offline).",
        point2: "✓ Nothing is stored. Passwords are never saved anywhere unless you copy them.",
        point3: "✓ Cryptographically secure. Uses your browser's built-in secure random number generator.",
        point4: "✓ Open source. Anyone can review the code on GitHub.",
      },
      whenToUse: {
        title: "When to Use Each Method",
        randomTitle: "Use Random Passwords For:",
        randomList: [
          "Accounts stored in a password manager",
          "Maximum security in minimum space",
          "Websites with character requirements"
        ],
        dicewareTitle: "Use Diceware Passphrases For:",
        dicewareList: [
          "Master password for your password manager",
          "Disk encryption passwords",
          "Wi-Fi passwords you need to share or type often",
          "Any password you need to remember and type manually"
        ]
      },
      strength: {
        title: "Understanding Password Strength",
        description:
          "Password strength is measured in entropy bits. Each additional bit doubles the number of possible combinations, making passwords exponentially harder to crack.",
        guidelinesTitle: "Strength Guidelines:",
        weak: "🔴 0-40 bits: Weak — Avoid for important accounts",
        moderate: "🟠 40-60 bits: Moderate — Use only for low-risk accounts",
        strong: "🟡 60-80 bits: Strong — Good for most uses",
        veryStrong: "🟢 80-120 bits: Very Strong — Excellent for sensitive data",
        excessive: "🔵 120+ bits: Excessive — Overkill for most scenarios",
        example:
          "Example: A 6-word Diceware passphrase has ~77 bits of entropy, which would take from hundreds of years to trillions of years to crack, depending on the technology available.",
      },
      faq: {
        title: "Common Questions",
        q1: "How many words should my passphrase have?",
        a1: [
          "6 words is the sweet spot for most users — it provides strong security (~77 bits) while being reasonably easy to remember.",
          "Use 7-8 words for master passwords protecting sensitive information like password managers or encryption keys.",
          "Avoid using fewer than 5 words, as this significantly reduces security.",
          "Note: The number of words depends on the wordlist size you are using. In this case, it is assumed that you are using any of 7776 words wordlist. The smaller the wordlist, the more words you need to use to achieve the same security level."
        ],
        q2: "What's a good password strategy?",
        a2Title: "The best approach:",
        a2List: [
          "Use a password manager (like Bitwarden, 1Password, or ProtonPass)",
          "Create one strong Diceware passphrase (7-8 words) as your master password and make sure to remember it by heart and/or store it in a secure location (physical paper, encrypted file, etc.)",
          "Generate random passwords for all other accounts and store them in the password manager",
          "Enable two-factor authentication (2FA) wherever possible"
        ],
        a2Footer: "This way, you only memorize one password while having unique, strong passwords everywhere.",
        q3: "Why use Ukrainian wordlists?",
        a3: [
          "Passphrases in your native language are easier to remember and feel more natural. Passphrase UA is the first tool to offer comprehensive Ukrainian Diceware wordlists.",
          "The transliteration feature lets you type Ukrainian words using a standard Latin keyboard (e.g., \"собака\" becomes \"sobaka\"), making it easier to enter on any device while maintaining Ukrainian vocabulary."
        ],
        q4: "Should I exclude ambiguous characters in passwords?",
        a4: [
          "If you frequently type your password manually, excluding ambiguous characters (like 'O' vs '0', 'l' vs '1') reduces typing errors. This slightly decreases entropy but improves usability.",
          "For passwords stored in a password manager that you'll copy-paste, keep all characters for maximum strength."
        ],
        q5: "Can I use this tool offline?",
        a5: "Yes! After the page loads once, you can use it without a network connection. All generation happens locally in your browser, and wordlists are cached for offline use.",
        q6: "How is \"time to crack\" calculated?",
        a6: "We calculate the average time an attacker would need to guess your password by trying combinations. The calculation assumes a powerful adversary with 1 trillion guesses per second (using specialized hardware). Real-world attacks are usually much slower due to rate limiting and other protections. You can configure the guess rate in the advanced options.",
        q7: "What are good use cases for Diceware passphrases?",
        a7GoodTitle: "Excellent use cases:",
        a7GoodList: [
          "Master password for password managers",
          "Smart TVs and devices where typing symbols is difficult",
          "Wi-Fi passwords that you need to share with guests",
          "Shared computers where you can't install password managers",
          "Full-disk encryption passwords",
          "Any password you need to type frequently by hand"
        ],
        a7BadTitle: "Not recommended for:",
        a7BadList: [
          "Usage with small number of words (less than 5). This significantly reduces security"
        ],
        q8: "Should I add numbers or symbols to my passphrase?",
        a8: [
          "Generally, no — length is more important than complexity. Adding a single number or symbol only adds a few bits of entropy, while adding another word adds ~13 bits.",
          "For example: correct-horse-battery-staple-7 is barely stronger than correct-horse-battery-staple, but correct-horse-battery-staple-magnet is significantly stronger.",
          "Only add special characters if a website requires them — otherwise, keep it simple and memorable."
        ],
        q9: "Will a strong password protect me from phishing?",
        a9: [
          "Unfortunately, no. Even the strongest password in the world won't help if you enter it on a fake website. However, using unique passwords for each service means that if one gets phished, your other accounts remain safe."
        ],
        a9Title: "Protect yourself from phishing:",
        a9List: [
          "Always check the website URL before entering passwords",
          "Enable two-factor authentication (2FA) on all accounts",
          "Use a password manager — they won't autofill on fake sites",
          "Be suspicious of urgent emails or messages asking you to log in"
        ]
      },
      comparison: {
        title: "Detailed Method Comparison",
        feature: "Feature",
        randomPassword: "Random Password",
        dicewarePassphrase: "Diceware Passphrase",
        memorability: "Memorability",
        memorabilityRandom: "Very Difficult",
        memorabilityDiceware: "Easy",
        typingSpeed: "Typing Speed",
        typingSpeedRandom: "Slow (symbols, case)",
        typingSpeedDiceware: "Fast (just words)",
        length: "Typical Length",
        lengthRandom: "12-20 characters",
        lengthDiceware: "30-50 characters",
        entropyPerChar: "Entropy per Character",
        entropyRandom: "High (~6.5 bits)",
        entropyDiceware: "Lower (~2.6 bits)",
        totalSecurity: "Total Security (similar)",
        securityRandom: "16 chars ≈ 104 bits",
        securityDiceware: "6 words ≈ 77 bits",
        bestFor: "Best For",
        bestForRandom: "Password manager accounts",
        bestForDiceware: "Master passwords"
      },
      bestPractices: {
        title: "Security Best Practices",
        list: [
          "Use unique passwords for every account — never reuse",
          "Use a password manager to securely store all your passwords",
          "Enable two-factor authentication (2FA) on all important accounts",
          "Update passwords if there's a security breach",
          "Never share passwords via email, text, or messaging apps",
          "Don't use personal information (birthdays, names, pet names)",
          "Be suspicious of phishing attempts asking for passwords"
        ]
      },
      whatIsDiceware: {
        title: "What is Diceware?",
        description1:
          "Diceware is a method created by Arnold G. Reinhold in 1995 for generating secure, memorable passphrases. Originally, you would roll physical dice to randomly select words from a list.",
        description2:
          "This tool uses the same principle but with a cryptographically secure random number generator instead of dice. The wordlists are carefully curated to include only memorable, appropriate words while maintaining maximum security.",
        wordlistsTitle: "Available Wordlists:",
        ukrainian:
          "Ukrainian: First comprehensive Ukrainian Diceware wordlists (small, normal, large, 10K) with transliteration",
        english: "English: EFF, Beale and Original Diceware wordlists — time-tested and widely trusted",
      },
      similarTools: {
        title: "Similar Tools",
        description: "Other excellent password generators you might find useful:",
        dmuth: "Diceware Password Generator by Doug Muth",
        dmuthDescription:
          "Interactive Diceware generator with dice animation and EFF wordlist. Great for visualizing the randomness process.",
        strongphrase: "StrongPhrase",
        strongphraseDescription:
          "Advanced passphrase generator with detailed password strength analysis and cracking cost estimates. Excellent for understanding security metrics.",
      },
      passwordManager: {
        title: "Get a Password Manager",
        description: "Securely store and manage your strong passwords with these trusted tools:",
        bitwarden: "Bitwarden",
        bitwardenDescription: "Open-source password manager with free tier, cross-platform sync, and secure sharing. Excellent for teams and individuals.",
        keepass: "KeePassXC",
        keepassDescription: "Free, open-source, and offline password manager. Your passwords stay on your device — no cloud required.",
        proton: "Proton Pass",
        protonDescription: "Privacy-focused password manager from the ProtonMail team. End-to-end encrypted with zero-knowledge architecture.",
        onepassword: "1Password",
        onepasswordDescription: "Popular commercial password manager with excellent user experience, strong security features, and reliable cross-platform support.",
      },
      resources: {
        title: "Educational Resources",
        description: "Learn more about password security and the Diceware method:",
        eff: "EFF's Dice-Generated Passphrases",
        effDescription: "Comprehensive guide to the Diceware method with official EFF wordlists",
        original: "Original Diceware by Arnold G. Reinhold",
        originalDescription: "The original Diceware page from 1995 — the method that started it all",
        xkcd: "XKCD: Password Strength",
        xkcdDescription:
          'Famous comic explaining why "correct horse battery staple" is more secure and memorable than "Tr0ub4dor&3"',
        nist: "NIST Digital Identity Guidelines",
        nistDescription: "Official U.S. government guidelines on authentication and password security",
      },
    },

    privacy: {
      title: "Privacy Policy",
      lastUpdated: "Last Updated:",
      lastUpdatedDate: "November 18, 2025",
      overview: {
        title: "Overview",
        noDataMessage: "We DO NOT collect any data. Ever.",
        description: "Passphrase UA is a completely client-side application built with privacy as the core principle. All passwords and passphrases are generated locally in your browser and are never transmitted over the network, stored on our servers, or tracked in any way."
      },
      whatWeDontCollect: {
        title: "What We DON'T Collect",
        passwords: "Passwords or generated passphrases",
        accounts: "User accounts or email addresses",
        ipAddresses: "IP addresses or location information",
        analytics: "Usage analytics or telemetry",
        fingerprints: "Device fingerprints or tracking cookies",
        anyPersonalData: "Any personal data whatsoever"
      },
      whatWeStoreLocally: {
        title: "What We Store Locally",
        description: "In your browser (localStorage) — under your control",
        themePreference: "Theme Preference",
        themeDescription: "Your choice of light/dark mode (theme)",
        languagePreference: "Language Preference",
        languageDescription: "Your choice of Ukrainian/English (locale)",
        noPasswords: "No Passwords",
        noPasswordsDescription: "Passwords are never stored, even locally",
        clearSettings: "You can clear these settings at any time by clearing site data in your browser settings."
      },
      howItWorks: {
        title: "How It Works",
        clientSideGeneration: {
          title: "1. Client-Side Only Generation",
          description: "All passwords and passphrases are generated locally in your browser using the Web Crypto API (crypto.getRandomValues()). The generation code is JavaScript function that runs exclusively on your device."
        },
        noNetworkRequests: {
          title: "2. No Network Requests",
          description: "No network requests are made during password generation. You can verify this by opening your browser's Developer Tools (Network tab) — you won't see any requests during generation."
        },
        openSource: {
          title: "3. Open Source",
          description: "All code is open source and available on GitHub for audit. You can review every line of code to verify we keep our privacy promises."
        }
      },
      gdprCompliance: {
        title: "GDPR Compliance",
        description: "Passphrase UA is fully compliant with the General Data Protection Regulation (GDPR) and other privacy laws because we:",
        noPersonalData: "Do not collect any personal data",
        noUserIdentifyingInfo: "Do not process any user-identifying information",
        noTrackingCookies: "Do not use tracking cookies",
        userControl: "Give users full control over their settings",
        noDataToManage: "Since we collect no data, there is no data to request, export, or delete."
      },
      security: {
        title: "Security",
        description: "We implement numerous security measures to protect your privacy:",
        cryptoSecureRng: "Cryptographically secure random number generation (Web Crypto API)",
        strictCsp: "Strict Content Security Policy (CSP) headers",
        httpsWithHsts: "HTTPS by default with HSTS (HTTP Strict Transport Security)",
        noThirdPartyScripts: "No third-party scripts or tracking",
        regularAudits: "Regular security audits"
      },
      changesToPolicy: {
        title: "Changes to This Policy",
        description: "If we make changes to this privacy policy, we will update the \"Last Updated\" date at the top of this page. Since we don't collect contact information, we cannot notify you directly of changes. We encourage you to review this page periodically."
      },
      contact: {
        title: "Contact",
        description: "If you have questions about this privacy policy or Passphrase UA's privacy practices, you can:",
        openIssueOn: "Open an issue on ",
        reviewSourceCode: "Review the source code for complete transparency"
      },
      backToGenerator: "Back to Generator"
    },
  },

  uk: {
    header: {
      title: "Passphrase UA",
      subtitle: "Генерація безпечних паролів та фраз-паролів",
    },

    tabs: {
      password: "Пароль",
      passphrase: "Фраза-пароль",
      learn: "Навчання",
    },

    password: {
      length: "Довжина пароля",
      uppercase: "Великі літери (A-Z)",
      lowercase: "Малі літери (a-z)",
      numbers: "Цифри (0-9)",
      symbols: "Символи (!@#$)",
      advancedOptions: "Додаткові налаштування",
      excludeAmbiguous: "Виключити неоднозначні символи",
      excludeAmbiguousDetail: "(i, l, 1, L, o, 0, O)",
      generate: "Згенерувати пароль",
      generating: "Генерація...",
    },

    passphrase: {
      wordCount: "Кількість слів",
      words: "слів",
      sourceLanguage: "Мова словника",
      wordlist: "Словник",
      separator: "Роздільник",
      separatorSpace: "Пробіл",
      separatorDash: "Дефіс",
      separatorUnderscore: "Підкреслення",
      separatorPeriod: "Крапка",
      separatorNone: "Немає",
      separatorCustom: "Свій роздільник",
      customSeparator: "Свій роздільник",
      customSeparatorPlaceholder: "Введіть свій роздільник",
      capitalization: "Регістр",
      capNone: "Без змін (всі малі)",
      capFirst: "Перша літера кожного слова",
      capRandom: "Випадкова літера в кожному слові",
      capAll: "Усі великі",
      capRandomWord: "Випадкове слово всіма великими",
      includeNumber: "Додати число після слів",
      useTransliteration: "Використовувати транслітерацію (латиницею)",
      advancedOptions: "Додаткові налаштування",
      generate: "Згенерувати фразу-пароль",
      generating: "Генерація...",
    },

    wordlists: {
      en: {
        "eff-large": "EFF великий (7,776 слів)",
        "eff-short": "EFF короткий (1,296 слів)",
        "eff-short-2": "EFF короткий 2 (1,296 слів)",
        "beale": "Beale (7,776 слів)",
        "original": "Оригінальний Diceware (7,776 слів)",
      },
      uk: {
        wordlist: "Словник (10,000 слів)",
        "small-diceware": "Малий Diceware (1,296 слів)",
        "normal-diceware": "Звичайний Diceware (7,776 слів)",
        "large-diceware": "Великий Diceware (46,656 слів)",
      },
    },

    output: {
      entropy: "Ентропія",
      bits: "бітів",
      combinations: "Комбінацій",
      timeToCrack: "Тривалість злому",
      costToCrack: "Вартість злому",
      avgTime: "середній час",
      maxTime: "максимальний час",
      strengthLabel: "Надійність",
      strength: {
        weak: "Слабкий",
        moderate: "Помірний",
        strong: "Сильний",
        veryStrong: "Дуже сильний",
        excessive: "Надлишковий",
      },
      copy: "Копіювати",
      copied: "Скопійовано!",
      regenerate: "Згенерувати знову",
      regenerating: "Генерація...",
      configureMetrics: "Налаштувати метрики",
      guessRate: "Швидкість злому (спроб/сек)",
      costPer32: "Вартість за 2^32 спроб ($)",
      enterGuessRate: "Введіть кількість спроб за секунду",
      enterCost: "Введіть вартість за 2^32 спроб",
      guessRateMillion: "1 мільйон (10^6)",
      guessRateBillion: "1 мільярд (10^9)",
      guessRateTrillion: "1 трильйон (10^12)",
      guessRateQuadrillion: "1 квадрильйон (10^15)",
      guessRateCustom: "Свій",
    },

    footer: {
      securityNotice:
        "Усі паролі створюються безпосередньо у вашому браузері. Нічого не зберігається та не передається через мережу. Можна використовувати без підключення до мережі.",
      supportUkraine: "Підтримати Україну 🇺🇦",
      supportDescription:
        "Розгляньте можливість підтримки українських гуманітарних та оборонних організацій.",
      supportFundraising: "Або підтримайте наш поточний збір:",
      aboutProject: "Про проєкт",
      sourceCode: "Вихідний код",
      reportIssue: "Повідомити про проблему",
      documentation: "Документація",
      contact: "Контакт",
      privacy: "Конфіденційність",
    },

    theme: {
      toggleTheme: "Змінити тему",
      light: "Світла",
      dark: "Темна",
      system: "Системна",
    },

    toast: {
      copied: "Скопійовано!",
      copiedDescription: "Пароль скопійовано в буфер обміну",
      error: "Помилка",
      errorPassword: "Не вдалося згенерувати пароль",
      errorPassphrase: "Не вдалося згенерувати фразу-пароль",
    },

    learn: {
      title: "Посібник із безпеки паролів",
      gettingStarted: {
        title: "Початок роботи",
        description:
          "Надійні паролі захищають ваше цифрове життя. Цей інструмент допомагає створювати два типи безпечних паролів:",
        randomTitle: "🔐 Випадкові паролі",
        randomDescription:
          "Комбінація літер, цифр та символів. Дуже надійні, але складніші для запам'ятовування. Ідеально підходять для акаунтів, збережених у менеджері паролів.",
        randomExample: "K9#mP2@xL5qR",
        dicewareTitle: "💬 Фрази-паролі Diceware",
        dicewareDescription:
          "Випадкові слова, поєднані докупи. Легко запам'ятати та вводити, не нехтуючи безпекою. Чудово підходять для головного пароля для вашого менеджера паролів.",
        dicewareExample: "correct-horse-battery-staple",
      },
      safety: {
        title: "Чому цей інструмент безпечний",
        point1: "✓ Усе відбувається у вашому браузері. Паролі не надсилаються через мережу (після завантаження вебсайту ви можете користуватися ним без доступу до мережі).",
        point2: "✓ Нічого не зберігається. Паролі ніколи не зберігаються десь, якщо ви їх не скопіюєте самостійно.",
        point3: "✓ Криптографічно безпечний. Використовує вбудований генератор випадкових чисел вашого браузера.",
        point4: "✓ Відкритий код. Будь-хто може переглянути код на GitHub.",
      },
      whenToUse: {
        title: "Коли використовувати кожен метод",
        randomTitle: "Використовуйте випадкові паролі для:",
        randomList: [
          "Облікових записів, що зберігаються в менеджері паролів",
          "Максимальної безпеки з порівняно невеликою довжиною",
          "Вебсайтів з вимогами до символів"
        ],
        dicewareTitle: "Використовуйте фрази-паролі Diceware для:",
        dicewareList: [
          "Головного пароля для вашого менеджера паролів",
          "Паролів шифрування диска",
          "Паролів Wi-Fi, якими потрібно часто ділитися",
          "Будь-якого пароля, який потрібно запам'ятати та вводити вручну"
        ]
      },
      strength: {
        title: "Розуміння надійності паролів",
        description:
          "Надійність паролів вимірюється в бітах ентропії. Кожен додатковий біт подвоює кількість можливих комбінацій, роблячи паролі експоненційно складнішими для злому.",
        guidelinesTitle: "Рекомендації щодо надійності:",
        weak: "🔴 0-40 бітів: Слабкий — Уникайте для важливих облікових записів",
        moderate: "🟠 40-60 бітів: Помірний — Використовуйте лише для низькоризикових облікових записів",
        strong: "🟡 60-80 бітів: Сильний — Добре для більшості випадків",
        veryStrong: "🟢 80-120 бітів: Дуже сильний — Відмінно для чутливих даних",
        excessive: "🔵 120+ бітів: Надлишковий — Невиправдано складний для більшості сценаріїв",
        example:
          "Приклад: 6-слівна фраза-пароль Diceware має ~77 бітів ентропії, що б зайняло від сотень до трильйонів років для злому в залежності від доступних технологій.",
      },
      faq: {
        title: "Поширені запитання",
        q1: "Скільки слів повинна мати моя парольна фраза?",
        a1: [
          "6 слів — оптимальний вибір для більшості користувачів. Це забезпечує надійну безпеку (близько 77 бітів) і водночас легко запам'ятовується.",
          "Використовуйте 7-8 слів для головних паролів, що захищають конфіденційну інформацію, такі як менеджери паролів або ключі шифрування.",
          "Уникайте використання менше ніж 5 слів, оскільки це суттєво знижує безпеку.",
          "Пам'ятайте, що необхідна кількість слів залежить від розміру словника — чим менший словник, тим більше слів потрібно. У цьому випадку вважається, що ви використовуєте будь-який зі словників на 7,776 слів."
        ],
        q2: "Яка хороша стратегія паролів?",
        a2Title: "Найкращий підхід:",
        a2List: [
          "Використовуйте менеджер паролів (наприклад, Bitwarden, 1Password або ProtonPass)",
          "Створіть одну надійну фразу-пароль Diceware (7-8 слів) як головний пароль для менеджера паролів, запам'ятайте його та/або збережіть в безпечному місці (папір, зашифрований файл тощо)",
          "Генеруйте випадкові паролі для всіх інших облікових записів та зберігайте їх у менеджері паролів",
          "Вмикайте двофакторну автентифікацію (2FA) всюди, де це можливо"
        ],
        a2Footer: "Таким чином вам потрібно запам'ятати лише один пароль, маючи унікальні надійні паролі скрізь.",
        q3: "Навіщо використовувати українські словники?",
        a3: [
          "Фрази-паролі рідною мовою легше запам'ятовувати і вони відчуваються природніше. Passphrase UA — перший інструмент, що пропонує всеосяжні українські словники Diceware.",
          "Функція транслітерації дозволяє вводити українські слова стандартною латинською клавіатурою (наприклад, \"собака\" стає \"sobaka\"), що полегшує введення на будь-якому пристрої, зберігаючи українську лексику."
        ],
        q4: "Чи варто виключати неоднозначні символи в паролях?",
        a4: [
          "Якщо ви часто вводите пароль вручну, виключення неоднозначних символів (як-от 'O' чи '0', 'l' чи '1') зменшує помилки введення. Це трохи знижує ентропію, але покращує зручність.",
          "Для паролів, збережених у менеджері паролів, які ви копіюватимете, залишайте всі символи для максимальної безпеки."
        ],
        q5: "Чи можу я використовувати цей інструмент офлайн?",
        a5: "Так! Після першого завантаження сторінки ви можете використовувати її без підключення до мережі. Вся генерація відбувається локально у вашому браузері, а словники кешуються для офлайн-використання.",
        q6: "Як розраховується \"час на злом\"?",
        a6: "Ми розраховуємо середній час, який знадобиться зловмиснику для підбору вашого пароля шляхом перебору комбінацій. Розрахунок припускає, що працює потужний зловмисник з 1 трильйоном спроб на секунду (використовуючи спеціалізоване обладнання). Реальні атаки зазвичай набагато повільніші через обмеження швидкості та інші захисти. Ви можете змінити швидкість злому у додаткових налаштування.",
        q7: "Які хороші варіанти використання фраз-паролів Diceware?",
        a7GoodTitle: "Відмінні варіанти використання:",
        a7GoodList: [
          "Головний пароль для менеджерів паролів",
          "Смарт-телевізори та пристрої, де важко вводити символи",
          "Паролі Wi-Fi, якими потрібно ділитися з гостями",
          "Спільні комп'ютери, де не можна встановити менеджери паролів",
          "Паролі повного шифрування диска",
          "Будь-який пароль, який потрібно часто вводити вручну"
        ],
        a7BadTitle: "Не рекомендується для:",
        a7BadList: [
          "Використання з малою кількістю слів (менше ніж 5). Це значно зменшує безпеку"
        ],
        q8: "Чи варто додавати цифри або символи до моєї фрази-пароля?",
        a8: [
          "Загалом ні — довжина важливіша за складність. Додавання однієї цифри або символу додає лише кілька бітів ентропії, тоді як додавання ще одного слова додає ~13 бітів.",
          "Наприклад: correct-horse-battery-staple-7 ледь надійніший за correct-horse-battery-staple, але correct-horse-battery-staple-magnet значно надійніший.",
          "Додавайте спеціальні символи лише якщо вебсайт вимагає їх — інакше тримайте простоту та легкість запам'ятовування."
        ],
        q9: "Чи захистить мене надійний пароль від фішингу?",
        a9: [
          "На жаль, ні. Навіть найнадійніший пароль у світі не допоможе, якщо ви введете його на підробленому вебсайті. Однак використання унікальних паролів для кожного сервісу означає, що якщо один з них викрадуть через фішинг, ваші інші облікові записи залишаться в безпеці."
        ],
        a9Title: "Захистіть себе від фішингу:",
        a9List: [
          "Завжди перевіряйте URL вебсайту перед введенням паролів",
          "Вмикайте двофакторну автентифікацію (2FA) на всіх облікових записах",
          "Використовуйте менеджер паролів — вони не автозаповнюватимуть на підроблених вебсайтах",
          "Будьте підозрілими до термінових листів та повідомлень, що просять вас увійти в систему"
        ]
      },
      comparison: {
        title: "Детальне порівняння методів",
        feature: "Характеристика",
        randomPassword: "Випадковий пароль",
        dicewarePassphrase: "Фраза-пароль Diceware",
        memorability: "Запам'ятовуваність",
        memorabilityRandom: "Дуже складно",
        memorabilityDiceware: "Легко",
        typingSpeed: "Швидкість введення",
        typingSpeedRandom: "Повільно (символи, регістр)",
        typingSpeedDiceware: "Швидко (лише слова)",
        length: "Типова довжина",
        lengthRandom: "12-20 символів",
        lengthDiceware: "30-50 символів",
        entropyPerChar: "Ентропія на символ",
        entropyRandom: "Висока (~6.5 бітів)",
        entropyDiceware: "Нижча (~2.6 бітів)",
        totalSecurity: "Загальна безпека (подібна)",
        securityRandom: "16 символів ≈ 104 бітів",
        securityDiceware: "6 слів ≈ 77 бітів",
        bestFor: "Найкраще для",
        bestForRandom: "Акаунтів у менеджері паролів",
        bestForDiceware: "Головний пароль"
      },
      bestPractices: {
        title: "Найкращі практики безпеки",
        list: [
          "Використовуйте унікальні паролі для кожного облікового запису — ніколи не повторюйтесь",
          "Використовуйте менеджер паролів для безпечного зберігання всіх ваших паролів",
          "Вмикайте двофакторну автентифікацію (2FA) на всіх важливих облікових записах",
          "Оновлюйте паролі у разі порушення безпеки",
          "Ніколи не діліться паролями через email, SMS або месенджери",
          "Не використовуйте персональну інформацію (дати народження, імена, імена домашніх тварин)",
          "Остерігайтесь спроб фішингу, під час яких вас просять ввести паролі"
        ]
      },
      whatIsDiceware: {
        title: "Що таке Diceware?",
        description1:
          "Diceware — це метод, створений Арнольдом Г. Рейнгольдом у 1995 році для генерації безпечних, легких для запам'ятовування фраз-паролів. Спочатку кидали справжні кубики, щоб випадково вибрати слова зі списку.",
        description2:
          "Цей інструмент використовує той самий принцип, але з криптографічно безпечним генератором випадкових чисел замість кубиків. Словники ретельно підібрані, щоб включати лише запам'ятовувані, доречні слова, зберігаючи максимальну безпеку.",
        wordlistsTitle: "Доступні словники:",
        ukrainian:
          "Українська: Перші українські словники Diceware (малий, звичайний, великий, 10K) з транслітерацією",
        english:
          "Англійська: Словники EFF, Beale та Original Diceware — перевірені часом та широко довірені",
      },
      similarTools: {
        title: "Подібні інструменти",
        description: "Інші чудові генератори паролів, які можуть вам знадобитися:",
        dmuth: "Diceware Password Generator від Doug Muth",
        dmuthDescription:
          "Інтерактивний генератор Diceware з анімацією кубиків та словником EFF. Чудово для візуалізації процесу випадковості.",
        strongphrase: "StrongPhrase",
        strongphraseDescription:
          "Розширений генератор фраз-паролів з детальним аналізом надійності паролів та оцінками вартості злому. Відмінно для розуміння метрик безпеки.",
      },
      passwordManager: {
        title: "Отримайте менеджер паролів",
        description: "Безпечне зберігання та управління вашими надійними паролями за допомогою цих перевірених інструментів:",
        bitwarden: "Bitwarden",
        bitwardenDescription: "Менеджер паролів з відкритим кодом з безкоштовним тарифом, синхронізацією між платформами та безпечним спільним доступом. Відмінно для команд та окремих користувачів.",
        keepass: "KeePassXC",
        keepassDescription: "Безкоштовний, відкритий та офлайн менеджер паролів. Ваші паролі залишаються на вашому пристрої — хмара не потрібна.",
        proton: "Proton Pass",
        protonDescription: "Менеджер паролів, орієнтований на приватність від команди ProtonMail. Наскрізне шифрування з архітектурою нульового знання.",
        onepassword: "1Password",
        onepasswordDescription: "Популярний комерційний менеджер паролів з відмінним користувацьким досвідом, потужними функціями безпеки та надійною підтримкою між платформами.",
      },
      resources: {
        title: "Навчальні ресурси",
        description: "Дізнайтеся більше про безпеку паролів та метод Diceware:",
        eff: "Фрази-паролі, згенеровані кістками від EFF",
        effDescription: "Всебічний посібник з методу Diceware з офіційними словниками EFF",
        original: "Оригінальний Diceware від Arnold G. Reinhold",
        originalDescription: "Оригінальна сторінка Diceware з 1995 року — метод, з якого все почалося",
        xkcd: "XKCD: Надійність пароля",
        xkcdDescription:
          'Відомий комікс, що пояснює, чому "correct horse battery staple" безпечніший та легший для запам\'ятовування, ніж "Tr0ub4dor&3"',
        nist: "Настанови NIST щодо цифрової ідентифікації",
        nistDescription:
          "Офіційні настанови уряду США щодо аутентифікації та безпеки паролів",
      },
    },

    privacy: {
      title: "Політика конфіденційності",
      lastUpdated: "Останнє оновлення:",
      lastUpdatedDate: "18 листопада 2025",
      overview: {
        title: "Огляд",
        noDataMessage: "Ми НЕ збираємо жодних даних. Ніколи.",
        description: "Passphrase UA — це повністю клієнтський застосунок, створений з особливою увагою до конфіденційності. Усі паролі та фрази-паролі генеруються локально у вашому браузері та ніколи не передаються через мережу, не зберігаються на наших серверах і не відстежуються жодним чином."
      },
      whatWeDontCollect: {
        title: "Що ми НЕ збираємо",
        passwords: "Паролі або згенеровані парольні фрази",
        accounts: "Облікові записи користувачів або адреси електронної пошти",
        ipAddresses: "IP-адреси або інформацію про місцезнаходження",
        analytics: "Аналітику використання або телеметрію",
        fingerprints: "Відбитки пристроїв або файли cookie відстеження",
        anyPersonalData: "Будь-які персональні дані"
      },
      whatWeStoreLocally: {
        title: "Що зберігається локально",
        description: "У вашому браузері (localStorage) — під вашим контролем",
        themePreference: "Вибір теми",
        themeDescription: "Ваш вибір між світлою/темною темою (theme)",
        languagePreference: "Вибір мови",
        languageDescription: "Ваш вибір між українською/англійською мовою (locale)",
        noPasswords: "Без паролів",
        noPasswordsDescription: "Паролі ніколи не зберігаються, навіть локально",
        clearSettings: "Ви можете очистити ці налаштування в будь-який час, видаливши дані вебсайту в налаштуваннях вашого браузера."
      },
      howItWorks: {
        title: "Як це працює",
        clientSideGeneration: {
          title: "1. Генерація лише на стороні клієнта",
          description: "Усі паролі та парольні фрази генеруються безпосередньо у вашому браузері за допомогою Web Crypto API (crypto.getRandomValues()). Код генерації є функцією JavaScript, яка виконується виключно на вашому пристрої."
        },
        noNetworkRequests: {
          title: "2. Без мережевих запитів",
          description: "Під час генерації паролів мережеві запити не виконуються. Ви можете перевірити це, відкривши інструменти розробника вашого браузера (вкладка Мережа) — ви не побачите жодних запитів під час генерації."
        },
        openSource: {
          title: "3. Відкритий вихідний код",
          description: "Весь код відкритий і доступний на GitHub для аудиту. Ви можете перевірити кожен рядок коду, щоб переконатися, що ми дотримуємося своїх обіцянок щодо конфіденційності."
        }
      },
      gdprCompliance: {
        title: "Відповідність GDPR",
        description: "Passphrase UA повністю відповідає Загальному регламенту захисту даних (GDPR) та іншим законам про конфіденційність, оскільки ми:",
        noPersonalData: "Не збираємо жодних персональних даних",
        noUserIdentifyingInfo: "Не обробляємо жодної інформації, яка ідентифікує користувача",
        noTrackingCookies: "Не використовуємо файли cookie для відстеження",
        userControl: "Надаємо користувачам повний контроль над своїми налаштуваннями",
        noDataToManage: "Оскільки ми не збираємо жодних даних, немає даних для запиту, експорту чи видалення."
      },
      security: {
        title: "Безпека",
        description: "Ми реалізували численні заходи безпеки для захисту вашої конфіденційності:",
        cryptoSecureRng: "Криптографічно безпечна генерація випадкових чисел (Web Crypto API)",
        strictCsp: "Суворі заголовки Політики безпеки вмісту (CSP)",
        httpsWithHsts: "HTTPS за замовчуванням з HSTS (HTTP Strict Transport Security)",
        noThirdPartyScripts: "Без сторонніх скриптів або відстеження",
        regularAudits: "Регулярні аудити безпеки"
      },
      changesToPolicy: {
        title: "Зміни в цій політиці",
        description: "Якщо ми внесемо зміни до цієї політики конфіденційності, ми оновимо дату «Останнє оновлення» вгорі цієї сторінки. Оскільки ми не збираємо контактну інформацію, ми не можемо повідомити вас безпосередньо про зміни. Рекомендуємо періодично переглядати цю сторінку."
      },
      contact: {
        title: "Контакт",
        description: "Якщо у вас є питання щодо цієї політики конфіденційності або практик конфіденційності Passphrase UA, ви можете:",
        openIssueOn: "Відкрити проблему на ",
        reviewSourceCode: "Переглянути вихідний код для повної прозорості"
      },
      backToGenerator: "Повернутися до генератора"
    },
  },
}

