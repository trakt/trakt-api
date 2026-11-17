import { expect, test } from 'bun:test';

import {
  mediaRecommendationResponseSchema,
  movieRecommendationResponseSchema,
  showRecommendationResponseSchema,
  traktContract,
} from '../../index.ts';

const movie = {
  title: 'Dune: Part Three',
  year: 2026,
  ids: { trakt: 1, slug: 'dune-part-three-2026' },
};
const show = {
  title: 'Euphoria',
  year: 2019,
  ids: { trakt: 2, slug: 'euphoria-2019' },
};

test('movieRecommendationResponseSchema: parses an item with its score', () => {
  const parsed = movieRecommendationResponseSchema.parse({ movie, score: 0.9 });

  expect(parsed.movie.ids.trakt).toBe(1);
  expect(parsed.score).toBe(0.9);
});

test('showRecommendationResponseSchema: drops the sources the server still sends', () => {
  const parsed = showRecommendationResponseSchema.parse({
    show,
    score: 0.5,
    sources: [],
  });

  expect(parsed.show.ids.trakt).toBe(2);
  expect('sources' in parsed).toBe(false);
});

test('mediaRecommendationResponseSchema: carries a movie or a show under its own key', () => {
  const parsed = mediaRecommendationResponseSchema.parse({
    show,
    score: 0.5,
  });

  expect(parsed.show?.ids.trakt).toBe(2);
  expect(parsed.movie).toBeUndefined();
});

test('traktContract: lists the recommendations route on movies, shows and media', () => {
  expect(traktContract.movies.recommendations.path).toBe(
    '/movies/recommendations',
  );
  expect(traktContract.shows.recommendations.path).toBe(
    '/shows/recommendations',
  );
  expect(traktContract.media.recommendations.path).toBe(
    '/media/recommendations',
  );
});
