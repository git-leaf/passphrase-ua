/**
 * Dictionary Management
 * 
 * This module handles loading and managing word dictionaries for passphrase generation.
 */

// Dictionary Types
export {
  type Dictionary,
  type DictionaryEntry,
  type DictionaryMetadata,
  type DictionaryId,
  type DictionaryLanguage,
  type DictionaryName,
  type EnglishDictionaryName,
  type UkrainianDictionaryName,
  AVAILABLE_DICTIONARIES,
} from './types';

// Dictionary Loader
export {
  loadDictionary,
  preloadDictionary,
  clearDictionaryCache,
  getCachedDictionary,
  isDictionaryCached,
} from './loader';

