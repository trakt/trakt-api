import { typedMovieResponseSchema } from '../../../_internal/response/movieResponseSchema.ts';
import { z } from '../../../_internal/z.ts';

export const searchMovieResponseSchema = z.object({
  score: z.number().int(),
}).merge(typedMovieResponseSchema);
