import { float, z } from '../z.ts';
import { distributionResponseSchema } from './distributionResponseSchema.ts';

const externalRatingsResponseSchema = z.object({
  rating: float(z.number()).nullish(),
  link: z.string().nullish(),
});

export const ratingsResponseSchema = z.object({
  trakt: z.object({
    rating: float(z.number()),
    votes: z.number().int(),
    distribution: distributionResponseSchema,
  }),
  /***
   * Available if requesting extended `all`.
   */
  tmdb: externalRatingsResponseSchema.extend({
    votes: z.number().int().nullish(),
  }).nullish(),
  /***
   * Available if requesting extended `all`.
   */
  imdb: externalRatingsResponseSchema.extend({
    votes: z.number().int().nullish(),
  }).nullish(),
  /***
   * Available if requesting extended `all`.
   */
  metascore: z.object({
    rating: z.number().int().nullish(),
    link: z.string().nullish(),
  }),
  /***
   * Available if requesting extended `all`.
   */
  rotten_tomatoes: externalRatingsResponseSchema.extend({
    user_rating: z.number().int().nullish(),
    state: z.string().nullish(),
    user_state: z.string().nullish(),
  }).nullish(),
});
