import { z } from '../../../_internal/z.ts';

export const reorderRequestSchema = z.object({
  rank: z.array(z.number().int()),
});
