import { z } from '../z.ts';
import { distributionResponseSchema } from './distributionResponseSchema.ts';

const externalRatingsResponseSchema = z.object({
  rating: z.number().openapi({
    type: 'number',
    format: 'float',
  }).nullable(),
  link: z.string().nullable(),
});

export const ratingsResponseSchema = z.object({
  trakt: z.object({
    rating: z.number().openapi({
      type: 'number',
      format: 'float',
    }),
    votes: z.number().int(),
    distribution: distributionResponseSchema,
  }),
  /***
   * Available if requesting extended `all`.
   */
  tmdb: externalRatingsResponseSchema.extend({
    votes: z.number().int().nullable(),
  }).optional(),
  /***
   * Available if requesting extended `all`.
   */
  imdb: externalRatingsResponseSchema.extend({
    votes: z.number().int().nullable(),
  }).optional(),
  /***
   * Available if requesting extended `all`.
   */
  metascore: z.object({
    rating: z.number().int().nullable(),
    link: z.string().nullable(),
  }),
  /***
   * Available if requesting extended `all`.
   */
  rotten_tomatoes: externalRatingsResponseSchema.extend({
    user_rating: z.number().int().nullable(),
    state: z.string().nullable(),
    user_state: z.string().nullable(),
  }).optional(),
});
