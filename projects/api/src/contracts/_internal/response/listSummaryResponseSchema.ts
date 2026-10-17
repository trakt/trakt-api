import { z } from '../z.ts';

/** Zod schema for the list summary returned after a list item change. */
export const listSummaryResponseSchema = z.object({
  updated_at: z.string().datetime(),
  item_count: z.number().int(),
});
