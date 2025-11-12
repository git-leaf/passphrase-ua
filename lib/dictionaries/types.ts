/**
 * Dictionary Types
 * 
 * Type definitions for dictionary loading and management.
 */

/**
 * Dictionary metadata from file header
 */
export interface DictionaryMetadata {
  /** Dictionary name */
  name: string;
  /** Format (e.g., "INDEX WORD", "INDEX WORD TRANSLITERATION") */
  format: string;
  /** Language code (e.g., "en", "uk") */
  language: string;
  /** Transliteration language if available */
  transliteration?: string;
  /** Number of dice (4, 5, or 6) */
  dice?: number;
  /** Dictionary size */
  size: number;
  /** Source URL if available */
  source?: string;
  /** License information */
  license?: string;
}

/**
 * Dictionary entry (single word)
 */
export interface DictionaryEntry {
  /** Dice number index (e.g., "11111") */
  index: string;
  /** Word in original language */
  word: string;
  /** Transliteration if available */
  transliteration?: string;
}

/**
 * Loaded dictionary with metadata and entries
 */
export interface Dictionary {
  /** Dictionary metadata */
  metadata: DictionaryMetadata;
  /** Dictionary entries (words) */
  entries: DictionaryEntry[];
  /** Total word count */
  wordCount: number;
}

/**
 * Dictionary identifier
 */
export interface DictionaryId {
  /** Language code */
  language: 'en' | 'uk';
  /** Dictionary name */
  name: string;
}

/**
 * Available dictionaries configuration
 */
export const AVAILABLE_DICTIONARIES = {
  en: {
    'eff-large': {
      path: '/dictionaries/en/eff_large_diceware.txt',
      name: 'EFF Large',
      description: 'EFF Long List (7,776 words)',
      size: 7776,
      dice: 5,
    },
    'eff-short': {
      path: '/dictionaries/en/eff_short_diceware.txt',
      name: 'EFF Short',
      description: 'EFF Short List (1,296 words)',
      size: 1296,
      dice: 4,
    },
    'eff-short-2': {
      path: '/dictionaries/en/eff_short_diceware_2.txt',
      name: 'EFF Short 2',
      description: 'EFF Short List 2 (1,296 words)',
      size: 1296,
      dice: 4,
    },
    original: {
      path: '/dictionaries/en/original_diceware.txt',
      name: 'Original Diceware',
      description: 'Original Diceware (7,776 words)',
      size: 7776,
      dice: 5,
    },
    beale: {
      path: '/dictionaries/en/beale_diceware.txt',
      name: 'Beale',
      description: 'Beale List (7,776 words)',
      size: 7776,
      dice: 5,
    },
  },
  uk: {
    wordlist: {
      path: '/dictionaries/uk/wordlist.txt',
      name: 'Wordlist',
      description: 'Wordlist (10,000 words)',
      size: 10000,
      hasTransliteration: true,
      isDiceware: false,
    },
    small: {
      path: '/dictionaries/uk/small_diceware.txt',
      name: 'Small',
      description: 'Small (1,296 words)',
      size: 1296,
      dice: 4,
      hasTransliteration: true,
      isDiceware: true,
    },
    normal: {
      path: '/dictionaries/uk/normal_diceware.txt',
      name: 'Normal',
      description: 'Normal (7,776 words)',
      size: 7776,
      dice: 5,
      hasTransliteration: true,
      isDiceware: true,
    },
    large: {
      path: '/dictionaries/uk/large_diceware.txt',
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
 * Dictionary language type
 */
export type DictionaryLanguage = keyof typeof AVAILABLE_DICTIONARIES;

/**
 * Dictionary name for English
 */
export type EnglishDictionaryName = keyof typeof AVAILABLE_DICTIONARIES.en;

/**
 * Dictionary name for Ukrainian
 */
export type UkrainianDictionaryName = keyof typeof AVAILABLE_DICTIONARIES.uk;

/**
 * Any dictionary name
 */
export type DictionaryName = EnglishDictionaryName | UkrainianDictionaryName;

