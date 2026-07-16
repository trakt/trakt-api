import { movieResponseSchema } from '../../../_internal/response/movieResponseSchema.ts';
import { z } from '../../../_internal/z.ts';

/** Zod schema for the movie trending response. */
export const movieTrendingResponseSchema = z.object({
  watchers: z.number().int(),
  movie: movieResponseSchema,
});
