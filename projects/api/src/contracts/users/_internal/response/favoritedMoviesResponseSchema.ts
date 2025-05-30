import { movieResponseSchema } from '../../../_internal/response/movieResponseSchema.ts';
import { z } from '../../../_internal/z.ts';

export const favoritedMoviesResponseSchema = z.object({
  id: z.number().int(),
  listed_at: z.string().datetime(),
  notes: z.string().nullish(),
  type: z.literal('movie'),
  movie: movieResponseSchema,
  rank: z.number().int(),
});
