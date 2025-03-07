import { movieResponseSchema } from '../../../_internal/response/movieResponseSchema.ts';
import { z } from '../../../_internal/z.ts';
import { historyActionSchema } from './historyActionSchema.ts';

export const movieActivityHistoryResponseSchema = z.object({
  id: z.bigint(),
  watched_at: z.string(),
  movie: movieResponseSchema,
  action: historyActionSchema,
  type: z.literal('movie'),
});
