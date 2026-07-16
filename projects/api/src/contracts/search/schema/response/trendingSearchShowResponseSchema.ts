import { showResponseSchema } from '../../../_internal/response/showResponseSchema.ts';
import { int64, z } from '../../../_internal/z.ts';

/** Zod schema for the trending search show response. */
export const trendingSearchShowResponseSchema = z.object({
  id: int64(z.number().int()),
  count: z.number().int(),
  type: z.literal('show'),
  show: showResponseSchema.nullish(),
});
