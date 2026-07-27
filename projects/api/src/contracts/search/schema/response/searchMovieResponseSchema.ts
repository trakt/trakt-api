import { movieResponseSchema } from '../../../_internal/response/movieResponseSchema.ts';
import { double, z } from '../../../_internal/z.ts';

/** Zod schema for the search movie response. */
export const searchMovieResponseSchema = z.object({
  score: double(z.number()),
  type: z.literal('movie'),
  movie: movieResponseSchema.nullish(),
});
