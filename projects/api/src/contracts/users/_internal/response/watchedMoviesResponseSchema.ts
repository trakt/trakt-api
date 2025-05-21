import { movieIdsResponseSchema } from '../../../_internal/response/movieIdsResponseSchema.ts';
import { z } from '../../../_internal/z.ts';

export const watchedMoviesResponseSchema = z.array(
  z.object({
    plays: z.number().int(),
    last_watched_at: z.string().datetime(),
    last_updated_at: z.string().datetime(),
    movie: z.object({
      title: z.string(),
      year: z.number().int(),
      ids: movieIdsResponseSchema,
    }),
  }),
);
