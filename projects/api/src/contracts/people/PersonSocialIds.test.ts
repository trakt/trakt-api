import { expect, test } from 'bun:test';

import { personResponseSchema } from './schema/response/personResponseSchema.ts';

const ids = { slug: 'keanu-reeves', trakt: 1 };

test('personResponseSchema: keeps every social id', () => {
  const social_ids = {
    twitter: null,
    facebook: 'KeanuReevesofficial',
    instagram: null,
    tiktok: 'keanu',
    youtube: 'UC0000000000000000000000',
    wikidata: 'Q43416',
    wikipedia: 'Keanu_Reeves',
    wikipedia_language: 'de',
  };

  const parsed = personResponseSchema.parse({ name: 'Keanu', ids, social_ids });

  expect(parsed.social_ids).toEqual(social_ids);
});

test('personResponseSchema: social ids stay optional', () => {
  expect(
    personResponseSchema.safeParse({ name: 'Keanu', ids, social_ids: {} })
      .success,
  ).toBe(true);
});
