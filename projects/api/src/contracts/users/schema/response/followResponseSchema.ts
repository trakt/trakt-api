import { profileResponseSchema } from '../../../_internal/response/profileResponseSchema.ts';
import { z } from '../../../_internal/z.ts';

/** Zod schema for the follow response. */
export const followResponseSchema = z.object({
  approved_at: z.string().datetime().nullish(),
  user: profileResponseSchema,
});
