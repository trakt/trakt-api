import { expectTypeOf, test } from 'bun:test';

import type { HistoryAddRequest } from './index.ts';

test('@types/HistoryAddRequest: movie with id', () => {
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

  expectTypeOf<typeof movieWithId>().toEqualTypeOf<HistoryAddRequest>();
});

test('@types/HistoryAddRequest: movie should not work with tvdb', () => {
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

  expectTypeOf<typeof movieWithTvdb>().not.toEqualTypeOf<HistoryAddRequest>();
});

test('@types/HistoryAddRequest: movie with title and year', () => {
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

  expectTypeOf<
    typeof movieWithTitleAndYear
  >().toEqualTypeOf<HistoryAddRequest>();
});

test('@types/HistoryAddRequest: movie must be identifiable', () => {
  const emptyIds = {
    movies: [
      {
        watched_at: '2021-01-01T00:00:00Z',
      },
    ],
  };

  expectTypeOf<typeof emptyIds>().not.toEqualTypeOf<HistoryAddRequest>();
});

test('@types/HistoryAddRequest: show with id', () => {
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

  expectTypeOf<typeof showWithId>().toEqualTypeOf<HistoryAddRequest>();
});

test('@types/HistoryAddRequest: show with title and year', () => {
  const showWithTitleAndYear: HistoryAddRequest = {
    shows: [
      {
        title: 'Show Title',
        year: 2021,
        watched_at: '2021-01-01T00:00:00Z',
      },
    ],
  };

  expectTypeOf<
    typeof showWithTitleAndYear
  >().toEqualTypeOf<HistoryAddRequest>();
});

test('@types/HistoryAddRequest: show with season', () => {
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

  expectTypeOf<typeof showWithSeason>().toEqualTypeOf<HistoryAddRequest>();
});

test('@types/HistoryAddRequest: show with episode in season', () => {
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

  expectTypeOf<
    typeof showWithEpisodeInSeason
  >().toEqualTypeOf<HistoryAddRequest>();
});

test('@types/HistoryAddRequest: show must be identifiable', () => {
  const emptyIds = {
    shows: [
      {
        watched_at: '2021-01-01T00:00:00Z',
      },
    ],
  };

  expectTypeOf<typeof emptyIds>().not.toEqualTypeOf<HistoryAddRequest>();
});

test('@types/HistoryAddRequest: season with id', () => {
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

  expectTypeOf<typeof season>().toEqualTypeOf<HistoryAddRequest>();
});

test('@types/HistoryAddRequest: season should not allow tmdb ids', () => {
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

  expectTypeOf<typeof seasonWithTmdb>().not.toEqualTypeOf<HistoryAddRequest>();
});

test('@types/HistoryAddRequest: episode with id', () => {
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

  expectTypeOf<typeof episode>().toEqualTypeOf<HistoryAddRequest>();
});
