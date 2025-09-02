import { bulkMediaRequestSchema } from '../../../_internal/request/bulkMediaRequestSchema.ts';
import { z } from '../../../_internal/z.ts';

export const hiddenRemoveResponseSchema = z.object({
  deleted: z.object({ movies: z.number().int(), episodes: z.number().int() }),
  not_found: bulkMediaRequestSchema,
});
