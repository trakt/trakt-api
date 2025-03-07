import { bulkMediaRequestSchema } from '../../../_internal/request/bulkMediaRequestSchema.ts';
import { z } from '../../../_internal/z.ts';

const historyChangeCountSchema = z.object({
  movies: z.number(),
  episodes: z.number(),
});

export const historyRemoveResponseSchema = z.object({
  added: historyChangeCountSchema,
  removed: historyChangeCountSchema,
  not_found: bulkMediaRequestSchema,
});
