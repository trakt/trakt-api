import { movieResponseSchema } from '../../../_internal/response/movieResponseSchema.ts';
import { z } from '../../../_internal/z.ts';

export const movieAnticipatedResponseSchema = z.object({
  list_count: z.number().int(),
  movie: movieResponseSchema,
});
