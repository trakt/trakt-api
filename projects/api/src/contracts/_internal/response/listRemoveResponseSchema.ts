import { bulkMediaRequestSchema } from '../request/bulkMediaRequestSchema.ts';
import { z } from '../z.ts';
import { mediaMutationCountsSchema } from './mediaMutationCountsSchema.ts';

export const listRemoveResponseSchema = z.object({
  deleted: mediaMutationCountsSchema,
  not_found: bulkMediaRequestSchema,
  list: z.object({
    updated_at: z.string().datetime(),
    item_count: z.number().int(),
  }),
});
