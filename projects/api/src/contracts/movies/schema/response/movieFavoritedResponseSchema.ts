import { movieResponseSchema } from '../../../_internal/response/movieResponseSchema.ts';
import { z } from '../../../_internal/z.ts';

/** Zod schema for the movie favorited response. */
export const movieFavoritedResponseSchema = z.object({
  user_count: z.number().int(),
  movie: movieResponseSchema,
});
