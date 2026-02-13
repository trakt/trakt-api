import { int64, z } from '../../../_internal/z.ts';
import { listResponseSchema } from '../../../models/index.ts';

export const searchListResponseSchema = z.object({
  score: int64(z.number().int()),
  type: z.literal('list'),
  list: listResponseSchema.nullish(),
});
