import { profileResponseSchema } from '../../../_internal/response/profileResponseSchema.ts';
import { z } from '../../../_internal/z.ts';

export const blockedUserResponseSchema = z.object({
  blocked_at: z.string().datetime(),
  user: profileResponseSchema,
});
