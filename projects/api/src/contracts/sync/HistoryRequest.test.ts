import { assertType, type IsExact } from '@std/testing/types';

import type { HistoryAddRequest } from './index.ts';

Deno.test('@types/HistoryAddRequest: movie with id', () => {
  const movieWithId: HistoryAddRequest = {
    movies: [
      {
        ids: {
          imdb: 'tt1234567',
        },
        watched_at: '2021-01-01T00:00:00Z',
      },
      {
        ids: {
          slug: 'movie-slug',
        },
        watched_at: '2021-01-01T00:00:00Z',
      },
      {
        ids: {
          tmdb: 123456,
        },
        watched_at: '2021-01-01T00:00:00Z',
      },
      {
        ids: {
          trakt: 123456,
        },
        watched_at: '2021-01-01T00:00:00Z',
      },
      {
        ids: {
          tmdb: 123456,
        },
      },
    ],
  };

  assertType<IsExact<typeof movieWithId, HistoryAddRequest>>(true);
});

Deno.test('@types/HistoryAddRequest: movie should not work with tvdb', () => {
  const movieWithTvdb = {
    movies: [
      {
        ids: {
          tvdb: 123456,
        },
        watched_at: '2021-01-01T00:00:00Z',
      },
    ],
  };

  assertType<IsExact<typeof movieWithTvdb, HistoryAddRequest>>(false);
});

Deno.test('@types/HistoryAddRequest: movie with title and year', () => {
  const movieWithTitleAndYear: HistoryAddRequest = {
    movies: [
      {
        title: 'Movie Title',
        year: 2021,
        watched_at: '2021-01-01T00:00:00Z',
      },
      {
        title: 'Movie Title',
        year: 2021,
      },
    ],
  };

  assertType<IsExact<typeof movieWithTitleAndYear, HistoryAddRequest>>(true);
});

Deno.test('@types/HistoryAddRequest: movie must be identifiable', () => {
  const emptyIds = {
    movies: [
      {
        watched_at: '2021-01-01T00:00:00Z',
      },
    ],
  };

  assertType<IsExact<typeof emptyIds, HistoryAddRequest>>(false);
});

Deno.test('@types/HistoryAddRequest: show with id', () => {
  const showWithId: HistoryAddRequest = {
    shows: [
      {
        ids: {
          imdb: 'tt1234567',
        },
        watched_at: '2021-01-01T00:00:00Z',
      },
      {
        ids: {
          slug: 'show-slug',
        },
        watched_at: '2021-01-01T00:00:00Z',
      },
      {
        ids: {
          tmdb: 123456,
        },
        watched_at: '2021-01-01T00:00:00Z',
      },
      {
        ids: {
          trakt: 123456,
        },
        watched_at: '2021-01-01T00:00:00Z',
      },
      {
        ids: {
          tvdb: 123456,
        },
        watched_at: '2021-01-01T00:00:00Z',
      },
    ],
  };

  assertType<IsExact<typeof showWithId, HistoryAddRequest>>(true);
});

Deno.test('@types/HistoryAddRequest: show with title and year', () => {
  const showWithTitleAndYear: HistoryAddRequest = {
    shows: [
      {
        title: 'Show Title',
        year: 2021,
        watched_at: '2021-01-01T00:00:00Z',
      },
    ],
  };

  assertType<IsExact<typeof showWithTitleAndYear, HistoryAddRequest>>(true);
});

Deno.test('@types/HistoryAddRequest: show with season', () => {
  const showWithSeason: HistoryAddRequest = {
    shows: [
      {
        ids: {
          imdb: 'tt1234567',
        },
        seasons: [
          {
            number: 1,
            watched_at: '2021-01-01T00:00:00Z',
            episodes: [],
          },
        ],
      },
    ],
  };

  assertType<IsExact<typeof showWithSeason, HistoryAddRequest>>(true);
});

Deno.test('@types/HistoryAddRequest: show with episode in season', () => {
  const showWithEpisodeInSeason: HistoryAddRequest = {
    shows: [
      {
        title: 'Show Title',
        year: 2021,
        seasons: [
          {
            number: 1,
            episodes: [
              {
                number: 1,
                watched_at: '2021-01-01T00:00:00Z',
              },
            ],
          },
        ],
      },
    ],
  };

  assertType<IsExact<typeof showWithEpisodeInSeason, HistoryAddRequest>>(true);
});

Deno.test('@types/HistoryAddRequest: show must be identifiable', () => {
  const emptyIds = {
    shows: [
      {
        watched_at: '2021-01-01T00:00:00Z',
      },
    ],
  };

  assertType<IsExact<typeof emptyIds, HistoryAddRequest>>(false);
});

Deno.test('@types/HistoryAddRequest: season with id', () => {
  const season: HistoryAddRequest = {
    seasons: [
      {
        ids: {
          trakt: 123456,
        },
        watched_at: '2021-01-01T00:00:00Z',
      },
      {
        ids: {
          tvdb: 123456,
        },
        watched_at: '2021-01-01T00:00:00Z',
      },
    ],
  };

  assertType<IsExact<typeof season, HistoryAddRequest>>(true);
});

Deno.test('@types/HistoryAddRequest: season should not allow tmdb ids', () => {
  const seasonWithTmdb = {
    seasons: [
      {
        ids: {
          tmdb: 123456,
        },
        watched_at: '2021-01-01T00:00:00Z',
      },
    ],
  };

  assertType<IsExact<typeof seasonWithTmdb, HistoryAddRequest>>(false);
});

Deno.test('@types/HistoryAddRequest: episode with id', () => {
  const episode: HistoryAddRequest = {
    episodes: [
      {
        ids: {
          trakt: 123456,
        },
        watched_at: '2021-01-01T00:00:00Z',
      },
      {
        ids: {
          tvdb: 123456,
        },
        watched_at: '2021-01-01T00:00:00Z',
      },
    ],
  };

  assertType<IsExact<typeof episode, HistoryAddRequest>>(true);
});
