import { movieResponseSchema } from '../../../_internal/response/movieResponseSchema.ts';
import { z } from '../../../_internal/z.ts';

export const calendarMovieResponseSchema = z.object({
  released: z.string(),
  movie: movieResponseSchema,
});
