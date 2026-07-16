import { profileResponseSchema } from '../../../_internal/response/profileResponseSchema.ts';
import { z } from '../../../_internal/z.ts';

/** Zod schema for the team member response. */
export const teamMemberResponseSchema = z.object({
  user: profileResponseSchema,
});
