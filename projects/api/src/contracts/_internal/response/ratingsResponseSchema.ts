import { z } from '../z.ts';
import { distributionResponseSchema } from './distributionResponseSchema.ts';

const externalRatingsResponseSchema = z.object({
  rating: z.number().nullable(),
  link: z.string().nullable(),
});

export const ratingsResponseSchema = z.object({
  trakt: z.object({
    rating: z.number(),
    votes: z.number(),
    distribution: distributionResponseSchema,
  }),
  /***
   * Available if requesting extended `all`.
   */
  tmdb: externalRatingsResponseSchema.extend({
    votes: z.number().nullable(),
  }).optional(),
  /***
   * Available if requesting extended `all`.
   */
  imdb: externalRatingsResponseSchema.extend({
    votes: z.number().nullable(),
  }).optional(),
  /***
   * Available if requesting extended `all`.
   */
  metascore: externalRatingsResponseSchema.optional(),
  /***
   * Available if requesting extended `all`.
   */
  rotten_tomatoes: externalRatingsResponseSchema.extend({
    user_rating: z.number().nullable(),
  }).optional(),
});
