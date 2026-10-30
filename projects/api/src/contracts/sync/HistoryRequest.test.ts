import { expect, test } from 'bun:test';

import { historyItemsRequestSchema } from '../_internal/request/historyItemsRequestSchema.ts';
import type { HistoryAddRequest } from './index.ts';

const accepts = (body: HistoryAddRequest) =>
  expect(historyItemsRequestSchema.safeParse(body).success).toBe(true);

const rejects = (body: unknown) =>
  expect(historyItemsRequestSchema.safeParse(body).success).toBe(false);

test('HistoryAddRequest: movie with each id', () => {
  accepts({
    movies: [
      { ids: { imdb: 'tt1234567' }, watched_at: '2021-01-01T00:00:00Z' },
      { ids: { slug: 'movie-slug' }, watched_at: '2021-01-01T00:00:00Z' },
      { ids: { tmdb: 123456 }, watched_at: '2021-01-01T00:00:00Z' },
      { ids: { trakt: 123456 }, watched_at: '2021-01-01T00:00:00Z' },
      { ids: { tmdb: 123456 } },
    ],
  });
});

test('HistoryAddRequest: movie rejects tvdb ids', () => {
  const body: HistoryAddRequest = {
    // @ts-expect-error movies have no tvdb id
    movies: [{ ids: { tvdb: 123456 } }],
  };

  rejects(body);
});

test('HistoryAddRequest: movie by title, with or without year', () => {
  accepts({
    movies: [
      { title: 'Movie Title', year: 2021, watched_at: '2021-01-01T00:00:00Z' },
      { title: 'Movie Title', year: 2021 },
      { title: 'Movie Title' },
    ],
  });
});

test('HistoryAddRequest: watched_at keywords', () => {
  accepts({
    movies: [
      { ids: { trakt: 1 }, watched_at: 'released' },
      { ids: { trakt: 2 }, watched_at: 'unknown' },
      { ids: { trakt: 3 }, watched_at: 'now' },
    ],
  });
});

test('HistoryAddRequest: watched_at rejects other values', () => {
  rejects({ movies: [{ ids: { trakt: 1 }, watched_at: 'yesterday' }] });
  rejects({ movies: [{ ids: { trakt: 1 }, watched_at: '2021-01-01' }] });
});

test('HistoryAddRequest: show with each id', () => {
  accepts({
    shows: [
      { ids: { imdb: 'tt1234567' }, watched_at: '2021-01-01T00:00:00Z' },
      { ids: { slug: 'show-slug' }, watched_at: '2021-01-01T00:00:00Z' },
      { ids: { tmdb: 123456 }, watched_at: '2021-01-01T00:00:00Z' },
      { ids: { trakt: 123456 }, watched_at: '2021-01-01T00:00:00Z' },
      { ids: { tvdb: 123456 }, watched_at: '2021-01-01T00:00:00Z' },
    ],
  });
});

test('HistoryAddRequest: show by title', () => {
  accepts({
    shows: [
      { title: 'Show Title', year: 2021, watched_at: '2021-01-01T00:00:00Z' },
      { title: 'Show Title' },
    ],
  });
});

test('HistoryAddRequest: show season with and without episodes', () => {
  accepts({
    shows: [
      {
        ids: { imdb: 'tt1234567' },
        seasons: [
          { number: 1, watched_at: '2021-01-01T00:00:00Z', episodes: [] },
          { number: 2, watched_at: 'released' },
        ],
      },
    ],
  });
});

test('HistoryAddRequest: show episode in season', () => {
  accepts({
    shows: [
      {
        title: 'Show Title',
        year: 2021,
        seasons: [
          {
            number: 1,
            episodes: [{ number: 1, watched_at: '2021-01-01T00:00:00Z' }],
          },
        ],
      },
    ],
  });
});

test('HistoryAddRequest: season with each id', () => {
  accepts({
    seasons: [
      { ids: { trakt: 123456 }, watched_at: '2021-01-01T00:00:00Z' },
      { ids: { tvdb: 123456 }, watched_at: '2021-01-01T00:00:00Z' },
      { ids: { tmdb: 123456 }, watched_at: '2021-01-01T00:00:00Z' },
    ],
  });
});

test('HistoryAddRequest: episode with each id', () => {
  accepts({
    episodes: [
      { ids: { trakt: 123456 }, watched_at: '2021-01-01T00:00:00Z' },
      { ids: { tvdb: 123456 }, watched_at: '2021-01-01T00:00:00Z' },
      { ids: { tmdb: 123456 }, watched_at: '2021-01-01T00:00:00Z' },
      { ids: { imdb: 'tt1234567' }, watched_at: '2021-01-01T00:00:00Z' },
    ],
  });
});

test('HistoryAddRequest: episode rejects ids without any id', () => {
  const body: HistoryAddRequest = {
    // @ts-expect-error episodes need at least one id
    episodes: [{ ids: {} }],
  };

  rejects(body);
  rejects({ episodes: [{ ids: { trakt: null } }] });
});

test('HistoryAddRequest: no notes', () => {
  const body: HistoryAddRequest = {
    // @ts-expect-error history items carry no notes
    movies: [{ ids: { trakt: 1 }, notes: 'note' }],
  };

  expect(historyItemsRequestSchema.parse(body).movies?.[0]).not.toHaveProperty(
    'notes',
  );
});
