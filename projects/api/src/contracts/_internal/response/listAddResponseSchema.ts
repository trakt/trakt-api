import { bulkMediaRequestSchema } from '../request/bulkMediaRequestSchema.ts';
import { z } from '../z.ts';
import { mediaMutationCountsSchema } from './mediaMutationCountsSchema.ts';

export const listAddResponseSchema = z.object({
  added: mediaMutationCountsSchema,
  existing: mediaMutationCountsSchema,
  not_found: bulkMediaRequestSchema,
  list: z.object({
    updated_at: z.string(),
    item_count: z.number(),
  }),
});
