import { expect, test } from 'bun:test';

import {
  anticipatedMediaRecommendationResponseSchema,
  anticipatedMovieRecommendationResponseSchema,
  anticipatedShowRecommendationResponseSchema,
  traktContract,
} from '../../index.ts';

const movie = {
  title: 'Dune: Part Three',
  year: 2026,
  ids: { trakt: 1, slug: 'dune-part-three-2026' },
};
const show = {
  title: 'Euphoria',
  year: 2027,
  ids: { trakt: 2, slug: 'euphoria-2019' },
};

test('anticipatedMovieRecommendationResponseSchema: parses a dated movie item', () => {
  const item = {
    movie,
    score: 0.82,
    sources: [],
    released: '2027-03-12',
  };

  const parsed = anticipatedMovieRecommendationResponseSchema.parse(item);

  expect(parsed.released).toBe('2027-03-12');
});

test('anticipatedShowRecommendationResponseSchema: keeps an unknown release as null', () => {
  const parsed = anticipatedShowRecommendationResponseSchema.parse({
    show,
    score: 0.4,
    sources: [],
    released: null,
  });

  expect(parsed.released).toBeNull();
});

test('anticipatedMediaRecommendationResponseSchema: parses movie and show items', () => {
  const items = [
    { movie, score: 0.9, sources: [], released: '2027-03-12' },
    { show, score: 0.5, sources: [], released: null },
  ].map((item) => anticipatedMediaRecommendationResponseSchema.parse(item));

  expect(items[0]?.movie?.title).toBe(movie.title);
  expect(items[0]?.show).toBeUndefined();
  expect(items[1]?.show?.title).toBe(show.title);
  expect(items[1]?.released).toBeNull();
});

test('anticipatedMovieRecommendationResponseSchema: rejects a missing released field', () => {
  expect(
    anticipatedMovieRecommendationResponseSchema.safeParse({
      movie,
      score: 1,
      sources: [],
    }).success,
  ).toBe(false);
});

test('traktContract: declares the anticipated routes for movies, shows and media', () => {
  expect(traktContract.movies.anticipatedRecommendations.path).toBe(
    '/movies/recommendations/anticipated',
  );
  expect(traktContract.shows.anticipatedRecommendations.path).toBe(
    '/shows/recommendations/anticipated',
  );
  expect(traktContract.media.anticipatedRecommendations.path).toBe(
    '/media/recommendations/anticipated',
  );
});
