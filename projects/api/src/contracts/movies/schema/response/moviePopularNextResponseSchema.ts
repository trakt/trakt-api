import { movieResponseSchema } from '../../../_internal/response/movieResponseSchema.ts';
import { z } from '../../../_internal/z.ts';

/** Zod schema for the movie popular/next response. */
export const moviePopularNextResponseSchema = z.object({
  rank: z.number().int().nullable(),
  plays: z.number().int(),
  watchers: z.number().int(),
  movie: movieResponseSchema,
});
