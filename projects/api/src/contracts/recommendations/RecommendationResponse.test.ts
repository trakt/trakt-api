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

test('movieRecommendationResponseSchema: parses an item with sources and no people', () => {
  const parsed = movieRecommendationResponseSchema.parse({
    movie,
    score: 0.9,
    sources: [{ id: 3, type: 'favorite', stars: null, movie }],
  });

  expect(parsed.movie.ids.trakt).toBe(1);
  expect(parsed.people).toBeUndefined();
});

test('showRecommendationResponseSchema: parses a subgenre source and a people reason', () => {
  const parsed = showRecommendationResponseSchema.parse({
    show,
    score: 0.5,
    sources: [
      {
        id: 4,
        type: 'subgenre',
        stars: 4,
        show,
        subgenres: [{ id: 1, name: 'Teen Drama', slug: 'teen-drama' }],
      },
    ],
    people: [
      {
        person: {
          name: 'Sam Levinson',
          ids: { trakt: 9, slug: 'sam-levinson' },
        },
        role: 'directing',
        watched_roles: ['directing'],
        watched_count: 2,
        titles: [{ show }],
      },
    ],
  });

  expect(parsed.people?.[0]?.watched_count).toBe(2);
});

test('mediaRecommendationResponseSchema: carries a movie or a show under its own key', () => {
  const parsed = mediaRecommendationResponseSchema.parse({
    show,
    score: 0.5,
    sources: [],
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
