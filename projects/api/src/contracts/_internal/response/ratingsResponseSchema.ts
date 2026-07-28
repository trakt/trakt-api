import { float, z } from '../z.ts';
import { distributionResponseSchema } from './distributionResponseSchema.ts';

/** Example of the default Trakt ratings response. */
export const ratingsResponseExample = {
  distribution: {
    1: 143,
    2: 239,
    3: 115,
    4: 483,
    5: 447,
    6: 2126,
    7: 2522,
    8: 6916,
    9: 3232,
    10: 8567,
  },
  rating: 8.29481,
  votes: 24789,
};

/** Example of the extended ratings shared by all media types. */
export const extendedRatingsResponseExample = {
  imdb: {
    link: 'https://www.imdb.com/title/tt9813792',
    rating: 7.8,
    votes: 199521,
  },
  metascore: {
    link: 'https://www.imdb.com/title/tt9813792/criticreviews',
    rating: 63,
  },
  rotten_tomatoes: {
    link: 'https://www.rottentomatoes.com/tv/from',
    rating: 96,
    state: 'fresh',
    user_rating: 76,
    user_state: 'upright',
  },
  tmdb: {
    link: 'https://www.themoviedb.org/tv/124364',
    rating: 8.5,
    votes: 4037,
  },
  trakt: {
    distribution: {
      1: 122,
      2: 87,
      3: 88,
      4: 215,
      5: 673,
      6: 1102,
      7: 2599,
      8: 4266,
      9: 2285,
      10: 4491,
    },
    rating: 8.11106,
    votes: 15928,
  },
};

/** Shared shape for an external rating source: a rating and a link, both nullish. */
export const externalRatingsResponseSchema = z.object({
  rating: float(z.number()).nullish(),
  link: z.string().nullish(),
});

/** Zod schema for the ratings response. */
export const ratingsResponseSchema = z.object({
  rating: float(z.number()).nullish(),
  votes: z.number().int().nullish(),
  distribution: distributionResponseSchema.nullish(),
  trakt: z.object({
    rating: float(z.number()),
    votes: z.number().int(),
    distribution: distributionResponseSchema,
  }).nullish(),
  /**
   * Available if requesting extended `all`.
   */
  tmdb: externalRatingsResponseSchema.extend({
    votes: z.number().int().nullish(),
  }).nullish(),
  /**
   * Available if requesting extended `all`.
   */
  imdb: externalRatingsResponseSchema.extend({
    votes: z.number().int().nullish(),
  }).nullish(),
  /**
   * Available if requesting extended `all`.
   */
  metascore: z.object({
    rating: z.number().int().nullish(),
    link: z.string().nullish(),
  }).nullish(),
  /**
   * Available if requesting extended `all`.
   */
  rotten_tomatoes: externalRatingsResponseSchema.extend({
    user_rating: z.number().int().nullish(),
    state: z.string().nullish(),
    user_state: z.string().nullish(),
  }).nullish(),
}).openapi({
  mediaExamples: {
    default: {
      summary: 'Default response',
      value: ratingsResponseExample,
    },
    extendedAll: {
      summary: 'Response with `extended=all`',
      value: extendedRatingsResponseExample,
    },
  },
});
