import { movieResponseSchema } from '../../../_internal/response/movieResponseSchema.ts';
import { asString, float, int64, z } from '../../../_internal/z.ts';

export const movieScrobbleResponseSchema = z.object({
  id: int64(z.number().int()),
  progress: float(z.number()),
  action: asString(z.enum(['start', 'pause', 'stop'])),
  movie: movieResponseSchema.nullish(),
});
