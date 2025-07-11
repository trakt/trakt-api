import { showResponseSchema } from '../../../_internal/response/showResponseSchema.ts';
import { z } from '../../../_internal/z.ts';
import { userProfileWithNotesSchema } from './userProfileWithNotesSchema.ts';

export const recommendedShowResponse = z.array(
  showResponseSchema
    .extend({
      favorited_by: z.array(userProfileWithNotesSchema).nullable(),
      recommended_by: z.array(userProfileWithNotesSchema).nullable(),
    }),
);
