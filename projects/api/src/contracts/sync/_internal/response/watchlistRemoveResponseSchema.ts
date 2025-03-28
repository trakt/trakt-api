import { bulkMediaRequestSchema } from '../../../_internal/request/bulkMediaRequestSchema.ts';
import { z } from '../../../_internal/z.ts';

export const watchlistRemoveResponseSchema = z.object({
  deleted: z.object({
    movies: z.number(),
    shows: z.number(),
    seasons: z.number(),
    episodes: z.number(),
  }),
  not_found: bulkMediaRequestSchema,
  list: z.object({
    updated_at: z.string(),
    item_count: z.number(),
  }),
});
