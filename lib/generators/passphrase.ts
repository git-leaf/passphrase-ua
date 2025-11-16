/**
 * Passphrase Generator
 * 
 * Generates cryptographically secure passphrases using Diceware method.
 * All functions are pure and testable (except wordlist loading).
 */

import { getSecureRandomValues } from './password';
import type { Wordlist } from '@/lib/wordlists/types';
import { loadWordlist } from '@/lib/wordlists/loader';
import { AVAILABLE_WORDLISTS } from '@/lib/wordlists/types';

/**
 * Capitalization style for passphrase words
 */
export type CapitalizationStyle = 
  | 'none'           // all lowercase (default)
  | 'first'          // First letter of each word
  | 'random'         // Random letter per word
  | 'all'            // ALL UPPERCASE
  | 'random-word';   // One random WORD in UPPERCASE

/**
 * Configuration for passphrase generation
 */
export interface PassphraseConfig {
  /** Number of words (4-12 recommended) */
  wordCount: number;
  /** Word separator */
  separator: string;
  /** Capitalization style */
  capitalization: CapitalizationStyle;
  /** Include random digits at the end */
  includeNumber: boolean;
  /** Wordlist to use */
  wordlist: Wordlist;
  /** Use transliteration if available */
  useTransliteration: boolean;
}

/**
 * Result of passphrase generation with metadata
 */
export interface PassphraseResult {
  /** Generated passphrase */
  passphrase: string;
  /** Entropy in bits */
  entropy: number;
  /** Wordlist size used */
  wordlistSize: number;
  /** Words used (without modifications) */
  words: string[];
  /** Metadata about generation */
  metadata: {
    method: 'passphrase';
    wordCount: number;
    wordlistSize: number;
    wordlistName: string;
    timestamp: number;
    config: PassphraseConfig;
  };
}

/**
 * Validates passphrase generation configuration
 * 
 * @param config - Passphrase configuration
 * @throws Error if configuration is invalid
 */
export function validatePassphraseConfig(config: PassphraseConfig): void {
  // Validate word count
  if (!Number.isInteger(config.wordCount) || config.wordCount < 1 || config.wordCount > 20) {
    throw new Error('Word count must be between 1 and 20');
  }

  // Validate wordlist
  if (!config.wordlist || !config.wordlist.entries || config.wordlist.entries.length === 0) {
    throw new Error('Invalid or empty wordlist');
  }

  // Validate separator (allow empty)
  if (typeof config.separator !== 'string') {
    throw new Error('Separator must be a string');
  }
}

/**
 * Calculates entropy for a passphrase
 * 
 * Formula: entropy = word_count × log₂(wordlist_size) + [number_entropy]
 * 
 * @param wordCount - Number of words
 * @param wordlistSize - Size of wordlist
 * @param includeNumber - Whether digits are included
 * @returns Entropy in bits
 */
export function calculatePassphraseEntropy(
  wordCount: number,
  wordlistSize: number,
  includeNumber: boolean
): number {
  if (wordCount <= 0 || wordlistSize <= 0) {
    return 0;
  }

  let entropy = wordCount * Math.log2(wordlistSize);

  // Add entropy for random number (4 digits = ~13.3 bits)
  if (includeNumber) {
    entropy += Math.log2(10000);
  }

  return entropy;
}

/**
 * Capitalizes a word according to the specified style
 * 
 * @param word - Word to capitalize
 * @param style - Capitalization style
 * @returns Capitalized word
 */
function capitalizeWord(word: string, style: CapitalizationStyle): string {
  if (!word) return word;

  switch (style) {
    case 'none':
      return word;
    
    case 'first':
      return word.charAt(0).toUpperCase() + word.slice(1);
    
    case 'random': {
      // Capitalize a random letter in the word
      const index = getSecureRandomValues(1, word.length)[0];
      return (
        word.slice(0, index) +
        word.charAt(index).toUpperCase() +
        word.slice(index + 1)
      );
    }
    
    case 'all':
      return word.toUpperCase();
    
    default:
      return word;
  }
}

/**
 * Generates a passphrase based on configuration
 * 
 * This function uses Web Crypto API for secure randomness.
 * Wordlist must be loaded before calling this function.
 * 
 * @param config - Passphrase generation configuration
 * @returns Passphrase generation result with metadata
 * @throws Error if configuration is invalid or generation fails
 */
export function generatePassphrase(config: PassphraseConfig): PassphraseResult {
  // Validate configuration
  validatePassphraseConfig(config);

  const { wordlist, wordCount, separator, capitalization, includeNumber, useTransliteration } = config;
  const wordlistSize = wordlist.entries.length;

  // Generate random word indices
  const randomIndices = getSecureRandomValues(wordCount, wordlistSize);

  // Select words from wordlist
  const selectedWords = randomIndices.map((index) => {
    const entry = wordlist.entries[index];
    
    // Use transliteration if requested and available
    if (useTransliteration && entry.transliteration) {
      return entry.transliteration;
    }
    
    return entry.word;
  });

  // Apply capitalization
  let words: string[];
  
  if (capitalization === 'random-word') {
    // Capitalize one random word completely
    const wordIndex = getSecureRandomValues(1, wordCount)[0];
    words = selectedWords.map((word, index) => 
      index === wordIndex ? word.toUpperCase() : word
    );
  } else {
    // Apply capitalization to each word
    words = selectedWords.map((word) => capitalizeWord(word, capitalization));
  }

  // Join words with separator
  let passphrase = words.join(separator);

  // Add random number if requested
  if (includeNumber) {
    const randomNumber = getSecureRandomValues(1, 10000)[0];
    const numberStr = randomNumber.toString().padStart(4, '0');
    passphrase += separator + numberStr;
  }

  // Calculate entropy
  const entropy = calculatePassphraseEntropy(wordCount, wordlistSize, includeNumber);

  // Return result with metadata
  return {
    passphrase,
    entropy,
    wordlistSize,
    words: selectedWords, // Original words without capitalization
    metadata: {
      method: 'passphrase',
      wordCount,
      wordlistSize,
      wordlistName: wordlist.metadata.name,
      timestamp: Date.now(),
      config,
    },
  };
}

/**
 * Convenience function to generate passphrase with wordlist path
 * 
 * Loads wordlist and generates passphrase in one call.
 * 
 * @param language - Language code ('en' or 'uk')
 * @param wordlistName - Wordlist name
 * @param options - Passphrase options (wordCount, separator, etc.)
 * @returns Passphrase generation result
 */
export async function generatePassphraseWithWordlist(
  language: 'en' | 'uk',
  wordlistName: string,
  options: Omit<PassphraseConfig, 'wordlist'>
): Promise<PassphraseResult> {
  // Get wordlist path
  const wordlists = AVAILABLE_WORDLISTS[language];
  const wordlistConfig = (wordlists as Record<string, {path: string; name: string; description: string; size: number; dice: number; hasTransliteration?: boolean}>)[wordlistName];
  
  if (!wordlistConfig) {
    throw new Error(`Wordlist not found: ${language}/${wordlistName}`);
  }

  // Load wordlist
  const wordlist = await loadWordlist(wordlistConfig.path);

  // Generate passphrase
  return generatePassphrase({
    ...options,
    wordlist,
  });
}

/**
 * Default configuration for passphrase generation
 */
export const DEFAULT_PASSPHRASE_CONFIG: Omit<PassphraseConfig, 'wordlist'> = {
  wordCount: 6,
  separator: '-',
  capitalization: 'none',
  includeNumber: false,
  useTransliteration: false,
};

