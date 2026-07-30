import { showResponseSchema } from '../../../_internal/response/showResponseSchema.ts';
import { z } from '../../../_internal/z.ts';

/** Zod schema for the show favorited response. */
export const showFavoritedResponseSchema = z.object({
  user_count: z.number().int(),
  show: showResponseSchema,
});
