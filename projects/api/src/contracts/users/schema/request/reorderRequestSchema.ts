import { z } from '../../../_internal/z.ts';

/** Zod schema for the reorder request. */
export const reorderRequestSchema = z.object({
  rank: z.array(z.number().int()),
});
