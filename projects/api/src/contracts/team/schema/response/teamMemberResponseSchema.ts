import { profileResponseSchema } from '../../../_internal/response/profileResponseSchema.ts';
import { z } from '../../../_internal/z.ts';

export const teamMemberResponseSchema = z.object({
  user: profileResponseSchema,
});
