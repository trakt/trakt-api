import { profileResponseSchema } from '../../../_internal/response/userProfileResponseSchema.ts';
import { z } from '../../../_internal/z.ts';

export const approveFollowerResponseSchema = z.object({
  followed_at: z.string(),
  user: profileResponseSchema,
});
