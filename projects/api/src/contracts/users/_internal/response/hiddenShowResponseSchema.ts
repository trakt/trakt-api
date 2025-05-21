import { showResponseSchema } from '../../../_internal/response/showResponseSchema.ts';
import { z } from '../../../_internal/z.ts';

export const hiddenShowResponseSchema = z.object({
  hidden_at: z.string().datetime(),
  type: z.literal('show'),
  show: showResponseSchema,
});
