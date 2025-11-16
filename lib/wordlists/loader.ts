/**
 * Wordlist Loader
 * 
 * Loads and parses wordlist files for passphrase generation.
 */

import type { Wordlist, WordlistEntry, WordlistMetadata } from './types';

/**
 * Wordlist cache to avoid re-loading
 */
const wordlistCache = new Map<string, Wordlist>();

/**
 * Parses wordlist metadata from header comments
 * 
 * @param lines - Wordlist file lines
 * @returns Parsed metadata
 */
function parseMetadata(lines: string[]): WordlistMetadata {
  const metadata: Partial<WordlistMetadata> = {
    name: 'Unknown',
    format: 'INDEX WORD',
    language: 'en',
    size: 0,
  };

  for (const line of lines) {
    if (!line.startsWith('#')) break;

    const match = line.match(/^#\s*(\w+):\s*(.+)$/);
    if (match) {
      const [, key, value] = match;
      const keyLower = key.toLowerCase();

      switch (keyLower) {
        case 'name':
          metadata.name = value.trim();
          break;
        case 'format':
          metadata.format = value.trim();
          break;
        case 'language':
          metadata.language = value.trim();
          break;
        case 'transliteration':
          metadata.transliteration = value.trim();
          break;
        case 'dice':
          metadata.dice = parseInt(value.trim(), 10);
          break;
        case 'size':
          metadata.size = parseInt(value.trim(), 10);
          break;
        case 'source':
          metadata.source = value.trim();
          break;
        case 'license':
          metadata.license = value.trim();
          break;
      }
    }
  }

  return metadata as WordlistMetadata;
}

/**
 * Parses a wordlist entry line
 * 
 * Supports two formats:
 * 1. Diceware: "INDEX WORD [TRANSLITERATION]"
 * 2. Simple: "WORD [TRANSLITERATION]"
 * 
 * @param line - Wordlist line
 * @param lineNumber - Line number for generating index
 * @returns Parsed entry or null if invalid
 */
function parseEntry(line: string, lineNumber: number): WordlistEntry | null {
  if (!line || line.startsWith('#')) {
    return null;
  }

  const parts = line.trim().split(/\s+/);
  
  if (parts.length < 1) {
    return null;
  }

  // Check if first part is a dice number (contains only digits 1-6)
  const isDicewareFormat = /^[1-6]+$/.test(parts[0]);

  if (isDicewareFormat && parts.length >= 2) {
    // Diceware format: INDEX WORD [TRANSLITERATION]
    const [index, word, transliteration] = parts;
    return {
      index,
      word,
      transliteration,
    };
  } else if (parts.length >= 1) {
    // Simple format: WORD [TRANSLITERATION]
    // Generate a sequential index
    const [word, transliteration] = parts;
    return {
      index: String(lineNumber),
      word,
      transliteration,
    };
  }

  return null;
}

/**
 * Loads a wordlist from a file path
 * 
 * @param path - Path to wordlist file (relative to public/)
 * @returns Loaded wordlist
 * @throws Error if wordlist fails to load or parse
 */
export async function loadWordlist(path: string): Promise<Wordlist> {
  // Check cache first
  if (wordlistCache.has(path)) {
    return wordlistCache.get(path)!;
  }

  try {
    // Fetch wordlist file
    const response = await fetch(path);
    
    if (!response.ok) {
      throw new Error(`Failed to load wordlist: ${response.statusText}`);
    }

    const text = await response.text();
    const lines = text.split('\n');

    // Parse metadata
    const metadata = parseMetadata(lines);

    // Parse entries
    const entries: WordlistEntry[] = [];
    let lineNumber = 0;
    for (const line of lines) {
      const entry = parseEntry(line, lineNumber);
      if (entry) {
        entries.push(entry);
        lineNumber++;
      }
    }

    // Validate
    if (entries.length === 0) {
      throw new Error('Wordlist is empty');
    }

    // Update metadata size if not set
    if (!metadata.size) {
      metadata.size = entries.length;
    }

    const wordlist: Wordlist = {
      metadata,
      entries,
      wordCount: entries.length,
    };

    // Cache the wordlist
    wordlistCache.set(path, wordlist);

    return wordlist;
  } catch (error) {
    throw new Error(
      `Failed to load wordlist from ${path}: ${error instanceof Error ? error.message : 'Unknown error'}`
    );
  }
}

/**
 * Preloads a wordlist (useful for prefetching)
 * 
 * @param path - Path to wordlist file
 */
export async function preloadWordlist(path: string): Promise<void> {
  await loadWordlist(path);
}

/**
 * Clears the wordlist cache
 */
export function clearWordlistCache(): void {
  wordlistCache.clear();
}

/**
 * Gets a cached wordlist without loading
 * 
 * @param path - Path to wordlist file
 * @returns Cached wordlist or null if not cached
 */
export function getCachedWordlist(path: string): Wordlist | null {
  return wordlistCache.get(path) || null;
}

/**
 * Checks if a wordlist is cached
 * 
 * @param path - Path to wordlist file
 * @returns True if cached
 */
export function isWordlistCached(path: string): boolean {
  return wordlistCache.has(path);
}

