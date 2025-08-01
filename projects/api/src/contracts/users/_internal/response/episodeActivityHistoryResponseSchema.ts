import { typedEpisodeResponseSchema } from '../../../_internal/response/episodeResponseSchema.ts';
import { int64, z } from '../../../_internal/z.ts';
import { historyActionSchema } from './historyActionSchema.ts';

export const episodeActivityHistoryResponseSchema = z.object({
  id: int64(z.number().int()),
  watched_at: z.string().datetime(),
  action: historyActionSchema,
}).merge(typedEpisodeResponseSchema);
