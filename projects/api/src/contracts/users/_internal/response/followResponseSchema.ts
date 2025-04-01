import { profileResponseSchema } from '../../../_internal/response/userProfileResponseSchema.ts';
import { z } from '../../../_internal/z.ts';

export const followResponseSchema = z.object({
  approved_at: z.string(),
  user: profileResponseSchema,
});
