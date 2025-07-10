import { int64, z } from '../../../_internal/z.ts';

export const historyIdsRequestSchema = z.object({
  ids: z.array(int64(z.number().int())).nullish(),
});
