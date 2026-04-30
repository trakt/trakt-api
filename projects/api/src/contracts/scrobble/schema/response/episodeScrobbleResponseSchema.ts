import { episodeResponseSchema } from '../../../_internal/response/episodeResponseSchema.ts';
import { showResponseSchema } from '../../../_internal/response/showResponseSchema.ts';
import { asString, float, int64, z } from '../../../_internal/z.ts';

export const episodeScrobbleResponseSchema = z.object({
  id: int64(z.number().int()),
  progress: float(z.number()),
  action: asString(z.enum(['start', 'pause', 'stop'])),
  episode: episodeResponseSchema.nullish(),
  show: showResponseSchema.nullish(),
});
