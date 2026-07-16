import { bulkMediaRequestSchema } from '../request/bulkMediaRequestSchema.ts';
import { z } from '../z.ts';
import { mediaMutationCountsSchema } from './mediaMutationCountsSchema.ts';

/** Zod schema for the list add response. */
export const listAddResponseSchema = z.object({
  added: mediaMutationCountsSchema,
  existing: mediaMutationCountsSchema,
  not_found: bulkMediaRequestSchema,
  list: z.object({
    updated_at: z.string().datetime(),
    item_count: z.number().int(),
  }),
});
