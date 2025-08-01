import { typedMovieResponseSchema } from '../../../_internal/response/movieResponseSchema.ts';
import { z } from '../../../_internal/z.ts';

export const favoritedMoviesResponseSchema = z.object({
  id: z.number().int(),
  listed_at: z.string().datetime(),
  notes: z.string().nullish(),
  rank: z.number().int(),
}).merge(typedMovieResponseSchema);
