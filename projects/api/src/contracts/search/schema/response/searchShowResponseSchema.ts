import { showResponseSchema } from '../../../_internal/response/showResponseSchema.ts';
import { double, z } from '../../../_internal/z.ts';

/** Zod schema for the search show response. */
export const searchShowResponseSchema = z.object({
  score: double(z.number()),
  type: z.literal('show'),
  show: showResponseSchema.nullish(),
});
