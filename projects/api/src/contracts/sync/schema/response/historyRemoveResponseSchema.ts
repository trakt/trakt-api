import { bulkMediaRequestSchema } from '../../../_internal/request/bulkMediaRequestSchema.ts';
import { z } from '../../../_internal/z.ts';

/** Zod schema for the history remove response. */
export const historyRemoveResponseSchema = z.object({
  deleted: z.object({ movies: z.number().int(), episodes: z.number().int() }),
  not_found: bulkMediaRequestSchema,
});
