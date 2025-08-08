import { typedMovieResponseSchema } from '../../../_internal/response/movieResponseSchema.ts';
import { int64, z } from '../../../_internal/z.ts';

export const searchMovieResponseSchema = z.object({
  score: int64(z.number().int()),
}).merge(typedMovieResponseSchema);
