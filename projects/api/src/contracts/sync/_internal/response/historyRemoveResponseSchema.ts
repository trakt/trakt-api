import { bulkMediaRequestSchema } from '../../../_internal/request/bulkMediaRequestSchema.ts';
import { z } from '../../../_internal/z.ts';

export const historyRemoveResponseSchema = z.object({
  deleted: z.object({ movies: z.number(), episodes: z.number() }),
  not_found: bulkMediaRequestSchema,
});
