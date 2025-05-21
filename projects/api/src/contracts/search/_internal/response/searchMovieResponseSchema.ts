import { movieResponseSchema } from '../../../_internal/response/movieResponseSchema.ts';
import { z } from '../../../_internal/z.ts';

export const searchMovieResponseSchema = z.object({
  type: z.literal('movie'),
  score: z.number().int(),
  movie: movieResponseSchema,
});
