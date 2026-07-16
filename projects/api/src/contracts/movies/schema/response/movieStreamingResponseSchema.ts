import { movieResponseSchema } from '../../../_internal/response/movieResponseSchema.ts';
import { z } from '../../../_internal/z.ts';

/** Zod schema for the movie streaming response. */
export const movieStreamingResponseSchema = z.object({
  rank: z.number().int(),
  delta: z.number().int().nullish(),
  movie: movieResponseSchema,
});
