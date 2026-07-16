import { movieResponseSchema } from '../../../_internal/response/movieResponseSchema.ts';
import { z } from '../../../_internal/z.ts';

/** Zod schema for the calendar movie response. */
export const calendarMovieResponseSchema = z.object({
  released: z.string(),
  movie: movieResponseSchema,
});
