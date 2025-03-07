import { z } from '../../../_internal/z.ts';

export const historyIdsRequestSchema = z.object({
  ids: z.array(z.number()).optional(),
});
