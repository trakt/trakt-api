import { movieResponseSchema } from '../../../_internal/response/movieResponseSchema.ts';
import { z } from '../../../_internal/z.ts';

export const movieFavoritedResponseSchema = z.object({
  user_count: z.number().int(),
  movie: movieResponseSchema,
});
