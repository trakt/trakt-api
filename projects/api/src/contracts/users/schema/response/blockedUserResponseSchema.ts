import { profileResponseSchema } from '../../../_internal/response/profileResponseSchema.ts';
import { z } from '../../../_internal/z.ts';

/** Zod schema for the blocked user response. */
export const blockedUserResponseSchema = z.object({
  blocked_at: z.string().datetime(),
  user: profileResponseSchema,
});
