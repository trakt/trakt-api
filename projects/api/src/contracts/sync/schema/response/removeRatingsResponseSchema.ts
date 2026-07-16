import { z } from '../../../_internal/z.ts';
import { ratingsParamSchema } from '../request/ratingsParamSchema.ts';

/** Zod schema for the remove ratings response. */
export const removeRatingsResponseSchema = z.object({
  deleted: z.object({
    movies: z.number().int(),
    shows: z.number().int(),
    seasons: z.number().int(),
    episodes: z.number().int(),
  }),
  not_found: ratingsParamSchema,
});
