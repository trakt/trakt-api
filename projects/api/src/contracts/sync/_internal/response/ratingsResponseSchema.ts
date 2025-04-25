import { z } from '../../../_internal/z.ts';
import { ratingsParamSchema } from '../request/ratingsParamSchema.ts';

export const ratingsSyncResponseSchema = z.object({
  added: z.object({
    movies: z.number(),
    shows: z.number(),
    seasons: z.number(),
    episodes: z.number(),
  }),
  not_found: ratingsParamSchema,
});
