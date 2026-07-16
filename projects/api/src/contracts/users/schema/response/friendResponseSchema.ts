import { profileResponseSchema } from '../../../_internal/response/profileResponseSchema.ts';
import { z } from '../../../_internal/z.ts';

/** Zod schema for the friend response. */
export const friendResponseSchema = z.object({
  friends_at: z.string().datetime(),
  user: profileResponseSchema,
});
