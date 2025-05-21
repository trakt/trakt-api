import { movieResponseSchema } from '../../../_internal/response/movieResponseSchema.ts';
import { z } from '../../../_internal/z.ts';

export const movieTrendingResponseSchema = z.object({
  watchers: z.number().int(),
  movie: movieResponseSchema,
});
