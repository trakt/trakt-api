import { showResponseSchema } from '../../../_internal/response/showResponseSchema.ts';
import { z } from '../../../_internal/z.ts';

export const showFavoritedResponseSchema = z.object({
  user_count: z.number().int(),
  show: showResponseSchema,
});
