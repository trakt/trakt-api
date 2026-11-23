import { movieResponseSchema } from '../../../_internal/response/movieResponseSchema.ts';
import { z } from '../../../_internal/z.ts';
import { userProfileWithNotesSchema } from './userProfileWithNotesSchema.ts';

/** Recommended movie response. */
export const recommendedMovieResponse = z.array(
  movieResponseSchema.extend({
    favorited_by: z.array(userProfileWithNotesSchema).nullish(),
    recommended_by: z.array(userProfileWithNotesSchema).nullish(),
  }),
);
