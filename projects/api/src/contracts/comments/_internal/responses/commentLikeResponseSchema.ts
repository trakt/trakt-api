import { profileResponseSchema } from '../../../_internal/response/userProfileResponseSchema.ts';
import { z } from '../../../_internal/z.ts';

export const commentLikeResponseSchema = z.object({
  liked_at: z.string(),
  user: profileResponseSchema,
});
