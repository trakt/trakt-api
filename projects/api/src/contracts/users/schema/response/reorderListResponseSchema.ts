import { z } from '../../../_internal/z.ts';
import { reorderListsResponseSchema } from './reorderListsResponseSchema.ts';

/** Zod schema for the reorder list response. */
export const reorderListResponseSchema = reorderListsResponseSchema.extend({
  list: z.object({
    updated_at: z.string().datetime(),
    item_count: z.number().int(),
  }),
});
