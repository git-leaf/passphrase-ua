/**
 * Passphrase Generator
 * 
 * Generates cryptographically secure passphrases using Diceware method.
 * All functions are pure and testable (except dictionary loading).
 */

import { getSecureRandomValues } from './password';
import type { Dictionary } from '@/lib/dictionaries/types';
import { loadDictionary } from '@/lib/dictionaries/loader';
import { AVAILABLE_DICTIONARIES } from '@/lib/dictionaries/types';

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
  /** Dictionary to use */
  dictionary: Dictionary;
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
  /** Dictionary size used */
  dictionarySize: number;
  /** Words used (without modifications) */
  words: string[];
  /** Metadata about generation */
  metadata: {
    method: 'passphrase';
    wordCount: number;
    dictionarySize: number;
    dictionaryName: string;
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

  // Validate dictionary
  if (!config.dictionary || !config.dictionary.entries || config.dictionary.entries.length === 0) {
    throw new Error('Invalid or empty dictionary');
  }

  // Validate separator (allow empty)
  if (typeof config.separator !== 'string') {
    throw new Error('Separator must be a string');
  }
}

/**
 * Calculates entropy for a passphrase
 * 
 * Formula: entropy = word_count × log₂(dictionary_size) + [number_entropy]
 * 
 * @param wordCount - Number of words
 * @param dictionarySize - Size of dictionary
 * @param includeNumber - Whether digits are included
 * @returns Entropy in bits
 */
export function calculatePassphraseEntropy(
  wordCount: number,
  dictionarySize: number,
  includeNumber: boolean
): number {
  if (wordCount <= 0 || dictionarySize <= 0) {
    return 0;
  }

  let entropy = wordCount * Math.log2(dictionarySize);

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
 * Dictionary must be loaded before calling this function.
 * 
 * @param config - Passphrase generation configuration
 * @returns Passphrase generation result with metadata
 * @throws Error if configuration is invalid or generation fails
 */
export function generatePassphrase(config: PassphraseConfig): PassphraseResult {
  // Validate configuration
  validatePassphraseConfig(config);

  const { dictionary, wordCount, separator, capitalization, includeNumber, useTransliteration } = config;
  const dictionarySize = dictionary.entries.length;

  // Generate random word indices
  const randomIndices = getSecureRandomValues(wordCount, dictionarySize);

  // Select words from dictionary
  const selectedWords = randomIndices.map((index) => {
    const entry = dictionary.entries[index];
    
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
  const entropy = calculatePassphraseEntropy(wordCount, dictionarySize, includeNumber);

  // Return result with metadata
  return {
    passphrase,
    entropy,
    dictionarySize,
    words: selectedWords, // Original words without capitalization
    metadata: {
      method: 'passphrase',
      wordCount,
      dictionarySize,
      dictionaryName: dictionary.metadata.name,
      timestamp: Date.now(),
      config,
    },
  };
}

/**
 * Convenience function to generate passphrase with dictionary path
 * 
 * Loads dictionary and generates passphrase in one call.
 * 
 * @param language - Language code ('en' or 'uk')
 * @param dictionaryName - Dictionary name
 * @param options - Passphrase options (wordCount, separator, etc.)
 * @returns Passphrase generation result
 */
export async function generatePassphraseWithDictionary(
  language: 'en' | 'uk',
  dictionaryName: string,
  options: Omit<PassphraseConfig, 'dictionary'>
): Promise<PassphraseResult> {
  // Get dictionary path
  const dictionaries = AVAILABLE_DICTIONARIES[language];
  const dictConfig = (dictionaries as Record<string, {path: string; name: string; description: string; size: number; dice: number; hasTransliteration?: boolean}>)[dictionaryName];
  
  if (!dictConfig) {
    throw new Error(`Dictionary not found: ${language}/${dictionaryName}`);
  }

  // Load dictionary
  const dictionary = await loadDictionary(dictConfig.path);

  // Generate passphrase
  return generatePassphrase({
    ...options,
    dictionary,
  });
}

/**
 * Default configuration for passphrase generation
 */
export const DEFAULT_PASSPHRASE_CONFIG: Omit<PassphraseConfig, 'dictionary'> = {
  wordCount: 6,
  separator: '-',
  capitalization: 'none',
  includeNumber: false,
  useTransliteration: false,
};

