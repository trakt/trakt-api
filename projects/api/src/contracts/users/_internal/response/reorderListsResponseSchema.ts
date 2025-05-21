import { z } from '../../../_internal/z.ts';

export const reorderListsResponseSchema = z.object({
  updated: z.number().int(),
  skipped_ids: z.array(z.number().int()),
});
