import { movieResponseSchema } from '../../../_internal/response/movieResponseSchema.ts';
import { z } from '../../../_internal/z.ts';
import { userProfileWithNotesSchema } from './userProfileWithNotesSchema.ts';

export const recommendedMovieResponse = z.array(
  movieResponseSchema
    .extend({
      favorited_by: z.array(userProfileWithNotesSchema).nullable(),
      recommended_by: z.array(userProfileWithNotesSchema).nullable(),
    }),
);
