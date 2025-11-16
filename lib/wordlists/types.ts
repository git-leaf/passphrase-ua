/**
 * Wordlist Types
 * 
 * Type definitions for wordlist loading and management.
 */

/**
 * Wordlist metadata from file header
 */
export interface WordlistMetadata {
  /** Wordlist name */
  name: string;
  /** Format (e.g., "INDEX WORD", "INDEX WORD TRANSLITERATION") */
  format: string;
  /** Language code (e.g., "en", "uk") */
  language: string;
  /** Transliteration language if available */
  transliteration?: string;
  /** Number of dice (4, 5, or 6) */
  dice?: number;
  /** Wordlist size */
  size: number;
  /** Source URL if available */
  source?: string;
  /** License information */
  license?: string;
}

/**
 * Wordlist entry (single word)
 */
export interface WordlistEntry {
  /** Dice number index (e.g., "11111") */
  index: string;
  /** Word in original language */
  word: string;
  /** Transliteration if available */
  transliteration?: string;
}

/**
 * Loaded wordlist with metadata and entries
 */
export interface Wordlist {
  /** Wordlist metadata */
  metadata: WordlistMetadata;
  /** Wordlist entries (words) */
  entries: WordlistEntry[];
  /** Total word count */
  wordCount: number;
}

/**
 * Wordlist identifier
 */
export interface WordlistId {
  /** Language code */
  language: 'en' | 'uk';
  /** Wordlist name */
  name: string;
}

/**
 * Available wordlists configuration
 */
export const AVAILABLE_WORDLISTS = {
  en: {
    'eff-large': {
      path: '/wordlists/en/eff_large_diceware.txt',
      name: 'EFF Large',
      description: 'EFF Long List (7,776 words)',
      size: 7776,
      dice: 5,
    },
    'eff-short': {
      path: '/wordlists/en/eff_short_diceware.txt',
      name: 'EFF Short',
      description: 'EFF Short List (1,296 words)',
      size: 1296,
      dice: 4,
    },
    'eff-short-2': {
      path: '/wordlists/en/eff_short_diceware_2.txt',
      name: 'EFF Short 2',
      description: 'EFF Short List 2 (1,296 words)',
      size: 1296,
      dice: 4,
    },
    original: {
      path: '/wordlists/en/original_diceware.txt',
      name: 'Original Diceware',
      description: 'Original Diceware (7,776 words)',
      size: 7776,
      dice: 5,
    },
    beale: {
      path: '/wordlists/en/beale_diceware.txt',
      name: 'Beale',
      description: 'Beale List (7,776 words)',
      size: 7776,
      dice: 5,
    },
  },
  uk: {
    wordlist: {
      path: '/wordlists/uk/wordlist.txt',
      name: 'Wordlist',
      description: 'Wordlist (10,000 words)',
      size: 10000,
      hasTransliteration: true,
      isDiceware: false,
    },
    small: {
      path: '/wordlists/uk/small_diceware.txt',
      name: 'Small',
      description: 'Small (1,296 words)',
      size: 1296,
      dice: 4,
      hasTransliteration: true,
      isDiceware: true,
    },
    normal: {
      path: '/wordlists/uk/normal_diceware.txt',
      name: 'Normal',
      description: 'Normal (7,776 words)',
      size: 7776,
      dice: 5,
      hasTransliteration: true,
      isDiceware: true,
    },
    large: {
      path: '/wordlists/uk/large_diceware.txt',
      name: 'Large',
      description: 'Large (46,656 words)',
      size: 46656,
      dice: 6,
      hasTransliteration: true,
      isDiceware: true,
    },
  },
} as const;

/**
 * Wordlist language type
 */
export type WordlistLanguage = keyof typeof AVAILABLE_WORDLISTS;

/**
 * Wordlist name for English
 */
export type EnglishWordlistName = keyof typeof AVAILABLE_WORDLISTS.en;

/**
 * Wordlist name for Ukrainian
 */
export type UkrainianWordlistName = keyof typeof AVAILABLE_WORDLISTS.uk;

/**
 * Any wordlist name
 */
export type WordlistName = EnglishWordlistName | UkrainianWordlistName;

