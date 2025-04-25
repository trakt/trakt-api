import { profileResponseSchema } from '../../../_internal/response/profileResponseSchema.ts';
import { z } from '../../../_internal/z.ts';

export const friendResponseSchema = z.object({
  friends_at: z.string(),
  user: profileResponseSchema,
});
