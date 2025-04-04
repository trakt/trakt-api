import { movieResponseSchema } from '../../../_internal/response/movieResponseSchema.ts';
import { z } from '../../../_internal/z.ts';

export const movieScrobbleResponseSchema = z.object({
  id: z.number(),
  action: z.enum(['start', 'pause', 'stop']),
  movie: movieResponseSchema,
});
