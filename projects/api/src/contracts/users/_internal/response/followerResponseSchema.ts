import { profileResponseSchema } from '../../../_internal/response/userProfileResponseSchema.ts';
import { z } from '../../../_internal/z.ts';

export const followerResponseSchema = z.object({
  followed_at: z.string(),
  user: profileResponseSchema,
});
