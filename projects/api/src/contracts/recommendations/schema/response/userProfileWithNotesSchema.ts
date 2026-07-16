import { profileResponseSchema } from '../../../_internal/response/profileResponseSchema.ts';
import { z } from '../../../_internal/z.ts';

/** Zod schema for user profile with notes. */
export const userProfileWithNotesSchema = profileResponseSchema
  .extend({
    notes: z.string(),
  });
