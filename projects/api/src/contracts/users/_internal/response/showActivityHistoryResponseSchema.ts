import { episodeResponseSchema } from '../../../_internal/response/episodeResponseSchema.ts';
import { showResponseSchema } from '../../../_internal/response/showResponseSchema.ts';
import { z } from '../../../_internal/z.ts';
import { historyActionSchema } from './historyActionSchema.ts';

export const showActivityHistoryResponseSchema = z.object({
  id: z.bigint(),
  watched_at: z.string(),
  action: historyActionSchema,
  type: z.literal('episode'),
  episode: episodeResponseSchema,
  show: showResponseSchema,
});
