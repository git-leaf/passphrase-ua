/**
 * Dictionary Loader
 * 
 * Loads and parses dictionary files for passphrase generation.
 */

import type { Dictionary, DictionaryEntry, DictionaryMetadata } from './types';

/**
 * Dictionary cache to avoid re-loading
 */
const dictionaryCache = new Map<string, Dictionary>();

/**
 * Parses dictionary metadata from header comments
 * 
 * @param lines - Dictionary file lines
 * @returns Parsed metadata
 */
function parseMetadata(lines: string[]): DictionaryMetadata {
  const metadata: Partial<DictionaryMetadata> = {
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

  return metadata as DictionaryMetadata;
}

/**
 * Parses a dictionary entry line
 * 
 * Supports two formats:
 * 1. Diceware: "INDEX WORD [TRANSLITERATION]"
 * 2. Simple: "WORD [TRANSLITERATION]"
 * 
 * @param line - Dictionary line
 * @param lineNumber - Line number for generating index
 * @returns Parsed entry or null if invalid
 */
function parseEntry(line: string, lineNumber: number): DictionaryEntry | null {
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
 * Loads a dictionary from a file path
 * 
 * @param path - Path to dictionary file (relative to public/)
 * @returns Loaded dictionary
 * @throws Error if dictionary fails to load or parse
 */
export async function loadDictionary(path: string): Promise<Dictionary> {
  // Check cache first
  if (dictionaryCache.has(path)) {
    return dictionaryCache.get(path)!;
  }

  try {
    // Fetch dictionary file
    const response = await fetch(path);
    
    if (!response.ok) {
      throw new Error(`Failed to load dictionary: ${response.statusText}`);
    }

    const text = await response.text();
    const lines = text.split('\n');

    // Parse metadata
    const metadata = parseMetadata(lines);

    // Parse entries
    const entries: DictionaryEntry[] = [];
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
      throw new Error('Dictionary is empty');
    }

    // Update metadata size if not set
    if (!metadata.size) {
      metadata.size = entries.length;
    }

    const dictionary: Dictionary = {
      metadata,
      entries,
      wordCount: entries.length,
    };

    // Cache the dictionary
    dictionaryCache.set(path, dictionary);

    return dictionary;
  } catch (error) {
    throw new Error(
      `Failed to load dictionary from ${path}: ${error instanceof Error ? error.message : 'Unknown error'}`
    );
  }
}

/**
 * Preloads a dictionary (useful for prefetching)
 * 
 * @param path - Path to dictionary file
 */
export async function preloadDictionary(path: string): Promise<void> {
  await loadDictionary(path);
}

/**
 * Clears the dictionary cache
 */
export function clearDictionaryCache(): void {
  dictionaryCache.clear();
}

/**
 * Gets a cached dictionary without loading
 * 
 * @param path - Path to dictionary file
 * @returns Cached dictionary or null if not cached
 */
export function getCachedDictionary(path: string): Dictionary | null {
  return dictionaryCache.get(path) || null;
}

/**
 * Checks if a dictionary is cached
 * 
 * @param path - Path to dictionary file
 * @returns True if cached
 */
export function isDictionaryCached(path: string): boolean {
  return dictionaryCache.has(path);
}

