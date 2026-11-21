import { describe, expect, it } from 'vitest';
import type { RandomBytes } from '@/lib/random/secure-random';
import type { Wordlist } from '@/lib/wordlists/types';
import { DEFAULT_PASSPHRASE_OPTIONS, generatePassphrase, type PassphraseOptions } from '../passphrase';

const fourWords: Wordlist = {
  entries: [
    { word: 'кіт', transliteration: 'kit' },
    { word: 'пес', transliteration: 'pes' },
    { word: 'сова', transliteration: 'sova' },
    { word: 'лис', transliteration: 'lys' },
  ],
};

const options: PassphraseOptions = {
  ...DEFAULT_PASSPHRASE_OPTIONS,
  wordCount: 3,
  separator: '-',
  capitalization: 'none',
  includeNumber: false,
  useTransliteration: false,
};

/** A byte source that hands out the given bytes in order. */
function fixedBytes(...values: number[]): RandomBytes {
  const queue = [...values];
  return (buffer) => {
    for (let i = 0; i < buffer.length; i++) {
      const next = queue.shift();
      if (next === undefined) throw new Error('fixedBytes exhausted');
      buffer[i] = next;
    }
  };
}

describe('generatePassphrase', () => {
  it('picks words by index and joins them with the separator', () => {
    const { secret } = generatePassphrase(fourWords, options, fixedBytes(0, 1, 2));

    expect(secret).toBe('кіт-пес-сова');
  });

  it('uses the Transliteration when asked', () => {
    const { secret } = generatePassphrase(
      fourWords,
      { ...options, useTransliteration: true },
      fixedBytes(0, 1, 3)
    );

    expect(secret).toBe('kit-pes-lys');
  });

  it.each([
    ['first', 'Кіт-Пес-Сова'],
    ['all', 'КІТ-ПЕС-СОВА'],
  ] as const)('capitalizes with style %s', (capitalization, expected) => {
    const { secret } = generatePassphrase(
      fourWords,
      { ...options, capitalization },
      fixedBytes(0, 1, 2)
    );

    expect(secret).toBe(expected);
  });

  it('uppercases one randomly chosen word with style random-word', () => {
    // Words 0, 1, 2, then byte 1 picks the second word
    const { secret } = generatePassphrase(
      fourWords,
      { ...options, capitalization: 'random-word' },
      fixedBytes(0, 1, 2, 1)
    );

    expect(secret).toBe('кіт-ПЕС-сова');
  });

  it('appends a zero-padded four-digit number after the separator', () => {
    // Words 0, 1, 2, then two bytes 0x00 0x07 make the number 7
    const { secret } = generatePassphrase(
      fourWords,
      { ...options, includeNumber: true },
      fixedBytes(0, 1, 2, 0x00, 0x07)
    );

    expect(secret).toBe('кіт-пес-сова-0007');
  });

  it('reports entropy as words × log2(wordlist size), plus log2(10^4) for the number', () => {
    expect(generatePassphrase(fourWords, options).entropy).toBeCloseTo(6);
    expect(generatePassphrase(fourWords, { ...options, includeNumber: true }).entropy).toBeCloseTo(
      6 + 13.2877,
      3
    );
  });

  it('counts only distinct words when Transliterations collide', () => {
    const collidingTransliterations: Wordlist = {
      entries: [
        { word: 'а', transliteration: 'a' },
        { word: 'б', transliteration: 'b' },
        { word: 'в', transliteration: 'b' },
        { word: 'г', transliteration: 'h' },
      ],
    };

    const { entropy } = generatePassphrase(collidingTransliterations, {
      ...options,
      useTransliteration: true,
    });

    expect(entropy).toBeCloseTo(3 * Math.log2(3));
  });

  it.each([2, 13, 4.5])('rejects %s words with invalid-word-count', (wordCount) => {
    expect(() => generatePassphrase(fourWords, { ...options, wordCount })).toThrow(
      expect.objectContaining({ code: 'invalid-word-count' })
    );
  });

  it('rejects a separator longer than three characters with invalid-separator', () => {
    expect(() => generatePassphrase(fourWords, { ...options, separator: '----' })).toThrow(
      expect.objectContaining({ code: 'invalid-separator' })
    );
  });
});
