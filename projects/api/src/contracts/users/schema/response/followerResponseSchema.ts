import { profileResponseSchema } from '../../../_internal/response/profileResponseSchema.ts';
import { z } from '../../../_internal/z.ts';

/** Zod schema for the follower response. */
export const followerResponseSchema = z.object({
  followed_at: z.string().datetime(),
  user: profileResponseSchema,
});
