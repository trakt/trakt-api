import { profileResponseSchema } from '../../../_internal/response/profileResponseSchema.ts';
import { z } from '../../../_internal/z.ts';

export const userProfileWithNotesSchema = profileResponseSchema
  .extend({
    notes: z.string(),
  });
