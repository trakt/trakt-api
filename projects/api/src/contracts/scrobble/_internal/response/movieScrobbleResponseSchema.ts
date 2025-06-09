import { movieResponseSchema } from '../../../_internal/response/movieResponseSchema.ts';
import { asString, z } from '../../../_internal/z.ts';

export const movieScrobbleResponseSchema = z.object({
  id: z.number().int(),
  action: asString(z.enum(['start', 'pause', 'stop'])),
  movie: movieResponseSchema,
});
