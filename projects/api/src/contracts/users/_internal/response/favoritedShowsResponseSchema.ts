import { showResponseSchema } from '../../../_internal/response/showResponseSchema.ts';
import { z } from '../../../_internal/z.ts';

export const favoritedShowsResponseSchema = z.object({
  id: z.number().int(),
  listed_at: z.string().datetime(),
  notes: z.string().nullable(),
  type: z.literal('show'),
  show: showResponseSchema,
  rank: z.number().int(),
});
