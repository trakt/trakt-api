import { movieResponseSchema } from '../../../_internal/response/movieResponseSchema.ts';
import { int64, z } from '../../../_internal/z.ts';

export const trendingSearchMovieResponseSchema = z.object({
  id: int64(z.number().int()),
  count: z.number().int(),
  type: z.literal('movie'),
  movie: movieResponseSchema.nullish(),
});
