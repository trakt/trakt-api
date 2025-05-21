import { showResponseSchema } from '../../../_internal/response/showResponseSchema.ts';
import { z } from '../../../_internal/z.ts';

export const searchShowResponseSchema = z.object({
  type: z.literal('show'),
  score: z.number().int(),
  show: showResponseSchema,
});
