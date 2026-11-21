import { readFile } from 'node:fs/promises';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';
import { WORDLIST_CATALOGUE, wordlistIds, type WordlistChoice } from '../catalogue';
import { createWordlistSource, type ReadText } from '../wordlist-source';

/** Reads the real wordlist files the app serves from public/. */
const readPublicFile: ReadText = (path) => readFile(join(process.cwd(), 'public', path), 'utf8');

const allChoices: WordlistChoice[] = [
  ...wordlistIds('en').map((id) => ({ language: 'en' as const, id })),
  ...wordlistIds('uk').map((id) => ({ language: 'uk' as const, id })),
];

describe('wordlist source', () => {
  it.each(allChoices)('loads $language/$id with as many entries as the catalogue says', async (choice) => {
    const wordlist = await createWordlistSource(readPublicFile).load(choice);
    const { size } = (WORDLIST_CATALOGUE[choice.language] as Record<string, { size: number }>)[
      choice.id
    ];

    expect(wordlist.entries).toHaveLength(size);
  });

  it('reads Diceware lines as word plus Transliteration, without the dice index', async () => {
    const wordlist = await createWordlistSource(readPublicFile).load({ language: 'uk', id: 'short' });

    expect(wordlist.entries[0]).toEqual({ word: 'авто', transliteration: 'avto' });
  });

  it('reads plain lines as word plus Transliteration', async () => {
    const wordlist = await createWordlistSource(readPublicFile).load({ language: 'uk', id: 'wordlist' });

    expect(wordlist.entries[0]).toEqual({ word: 'абажур', transliteration: 'abazhur' });
  });

  it('reads English Diceware lines as words without a Transliteration', async () => {
    const wordlist = await createWordlistSource(readPublicFile).load({ language: 'en', id: 'eff-short' });

    expect(wordlist.entries[0]).toEqual({ word: 'acid' });
  });

  it('reads a file once even when loads overlap', async () => {
    let reads = 0;
    const source = createWordlistSource((path) => {
      reads++;
      return readPublicFile(path);
    });

    const choice: WordlistChoice = { language: 'en', id: 'eff-short' };
    const [first, second] = await Promise.all([source.load(choice), source.load(choice)]);
    await source.load(choice);

    expect(reads).toBe(1);
    expect(second).toBe(first);
  });

  it('reports an unreadable file as wordlist-unavailable and retries on the next load', async () => {
    let attempts = 0;
    const source = createWordlistSource(async (path) => {
      attempts++;
      if (attempts === 1) throw new Error('network down');
      return readPublicFile(path);
    });
    const choice: WordlistChoice = { language: 'en', id: 'eff-short' };

    await expect(source.load(choice)).rejects.toMatchObject({ code: 'wordlist-unavailable' });
    await expect(source.load(choice)).resolves.toMatchObject({ entries: expect.any(Array) });
  });

  it('reports a file with no words as wordlist-unavailable', async () => {
    const source = createWordlistSource(async () => '# Name: Empty\n\n');

    await expect(source.load({ language: 'en', id: 'eff-short' })).rejects.toMatchObject({
      code: 'wordlist-unavailable',
    });
  });
});
