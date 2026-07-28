import { z } from '../z.ts';
import {
  extendedRatingsResponseExample,
  externalRatingsResponseSchema,
  ratingsResponseExample,
  ratingsResponseSchema,
} from './ratingsResponseSchema.ts';

/**
 * Zod schema for the movie ratings response - the shared ratings shape plus the
 * film-specific Letterboxd and MyAnimeList blocks.
 */
export const movieRatingsResponseSchema = ratingsResponseSchema.extend({
  /**
   * Letterboxd audience rating on a 0-5 scale. Films only.
   * Available if requesting extended `all`.
   */
  letterboxd: externalRatingsResponseSchema.extend({
    votes: z.number().int().nullish(),
  }).nullish(),
  /**
   * MyAnimeList audience rating on a 0-10 scale. Anime only.
   * Available if requesting extended `all`.
   */
  mal: externalRatingsResponseSchema.extend({
    votes: z.number().int().nullish(),
  }).nullish(),
}).openapi({
  mediaExamples: {
    default: {
      summary: 'Default response',
      value: ratingsResponseExample,
    },
    extendedAll: {
      summary: 'Response with `extended=all`',
      value: {
        ...extendedRatingsResponseExample,
        imdb: {
          link: 'https://www.imdb.com/title/tt37287335',
          rating: 7.9,
          votes: 269113,
        },
        letterboxd: {
          link: 'https://letterboxd.com/film/obsession-2025',
          rating: 4.12,
          votes: 3633569,
        },
        mal: {
          link: null,
          rating: null,
          votes: 0,
        },
        metascore: {
          link: 'https://www.imdb.com/title/tt37287335/criticreviews',
          rating: 77,
        },
        rotten_tomatoes: {
          link: 'https://www.rottentomatoes.com/m/obsession_2025',
          rating: 94,
          state: 'fresh',
          user_rating: 94,
          user_state: 'upright',
        },
        tmdb: {
          link: 'https://www.themoviedb.org/movie/1339713',
          rating: 8.251,
          votes: 3739,
        },
        trakt: ratingsResponseExample,
      },
    },
  },
});
