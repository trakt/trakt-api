import { bulkMediaRequestSchema } from '../../../_internal/request/bulkMediaRequestSchema.ts';
import { z } from '../../../_internal/z.ts';

export const historyResponseSchema = z.object({
  added: z.object({ movies: z.number(), episodes: z.number() }),
  updated: z.object({ movies: z.number(), episodes: z.number() }),
  not_found: bulkMediaRequestSchema,
});
