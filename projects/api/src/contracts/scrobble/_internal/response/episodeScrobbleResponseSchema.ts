import { episodeResponseSchema } from '../../../_internal/response/episodeResponseSchema.ts';
import { showResponseSchema } from '../../../_internal/response/showResponseSchema.ts';
import { z } from '../../../_internal/z.ts';

export const episodeScrobbleResponseSchema = z.object({
  id: z.number(),
  action: z.enum(['start', 'pause', 'stop']),
  episode: episodeResponseSchema,
  show: showResponseSchema,
});
