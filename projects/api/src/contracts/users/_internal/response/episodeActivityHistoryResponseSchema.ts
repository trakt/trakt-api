import { episodeResponseSchema } from '../../../_internal/response/episodeResponseSchema.ts';
import { showResponseSchema } from '../../../_internal/response/showResponseSchema.ts';
import { int64, z } from '../../../_internal/z.ts';
import { historyActionSchema } from './historyActionSchema.ts';

export const episodeActivityHistoryResponseSchema = z.object({
  id: int64(z.number().int()),
  watched_at: z.string().datetime(),
  action: historyActionSchema,
  type: z.literal('episode'),
  episode: episodeResponseSchema,
  show: showResponseSchema,
});
