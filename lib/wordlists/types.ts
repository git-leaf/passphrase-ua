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
