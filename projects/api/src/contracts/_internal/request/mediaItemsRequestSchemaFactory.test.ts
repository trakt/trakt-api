import { expect, test } from 'bun:test';

import type { z } from '../z.ts';
import { listRequestSchema } from './listRequestSchema.ts';
import { mediaItemsRequestSchema } from './mediaItemsRequestSchema.ts';

type ListItemsRequest = z.infer<typeof listRequestSchema>;
type MediaItemsRequest = z.infer<typeof mediaItemsRequestSchema>;

test('listRequestSchema: notes at every item level', () => {
  const body: ListItemsRequest = {
    movies: [{ ids: { trakt: 1 }, notes: 'movie' }],
    shows: [
      {
        ids: { trakt: 2 },
        notes: 'show',
        seasons: [
          {
            number: 1,
            notes: 'season',
            episodes: [{ number: 1, notes: 'episode' }],
          },
        ],
      },
    ],
    seasons: [{ ids: { trakt: 3 }, notes: 'season' }],
    episodes: [{ ids: { trakt: 4 }, notes: 'episode' }],
  };

  expect(listRequestSchema.parse(body)).toEqual(body);
});

test('listRequestSchema: no watched_at', () => {
  const body: ListItemsRequest = {
    // @ts-expect-error list items carry no watched_at
    movies: [{ ids: { trakt: 1 }, watched_at: '2021-01-01T00:00:00Z' }],
  };

  expect(listRequestSchema.parse(body).movies?.[0]).not.toHaveProperty(
    'watched_at',
  );
});

test('mediaItemsRequestSchema: title-only items and seasons without episodes', () => {
  const body: MediaItemsRequest = {
    movies: [{ title: 'Movie Title' }],
    shows: [{ title: 'Show Title', year: 2021, seasons: [{ number: 1 }] }],
    episodes: [{ ids: { imdb: 'tt1234567' } }],
  };

  expect(mediaItemsRequestSchema.parse(body)).toEqual(body);
});

test('mediaItemsRequestSchema: no notes and no watched_at', () => {
  const withNotes: MediaItemsRequest = {
    // @ts-expect-error collection items carry no notes
    movies: [{ ids: { trakt: 1 }, notes: 'note' }],
  };
  const withWatchedAt: MediaItemsRequest = {
    // @ts-expect-error collection items carry no watched_at
    episodes: [{ ids: { trakt: 1 }, watched_at: 'now' }],
  };

  expect(mediaItemsRequestSchema.parse(withNotes).movies?.[0]).toEqual({
    ids: { trakt: 1 },
  });
  expect(mediaItemsRequestSchema.parse(withWatchedAt).episodes?.[0]).toEqual({
    ids: { trakt: 1 },
  });
});
