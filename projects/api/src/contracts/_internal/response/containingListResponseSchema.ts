import { listResponseSchema } from './listResponseSchema.ts';
import { z } from '../z.ts';

/** A list the requested item appears on, plus the total number of such lists. */
export const containingListResponseSchema = listResponseSchema.extend({
  total_count: z.number().int(),
});
