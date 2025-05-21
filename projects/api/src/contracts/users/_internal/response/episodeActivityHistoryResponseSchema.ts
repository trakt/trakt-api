import { episodeResponseSchema } from '../../../_internal/response/episodeResponseSchema.ts';
import { showResponseSchema } from '../../../_internal/response/showResponseSchema.ts';
import { z } from '../../../_internal/z.ts';
import { historyActionSchema } from './historyActionSchema.ts';

export const episodeActivityHistoryResponseSchema = z.object({
  id: z.number().int(),
  watched_at: z.string().datetime(),
  action: historyActionSchema,
  type: z.literal('episode'),
  episode: episodeResponseSchema,
  show: showResponseSchema,
});
