import { movieResponseSchema } from '../../../_internal/response/movieResponseSchema.ts';
import { z } from '../../../_internal/z.ts';

export const movieStreamingResponseSchema = z.object({
  rank: z.number(),
  delta: z.number().nullable(),
  movie: movieResponseSchema,
});
