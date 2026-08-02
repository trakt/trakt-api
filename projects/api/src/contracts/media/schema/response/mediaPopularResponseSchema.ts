import { movieResponseSchema } from '../../../_internal/response/movieResponseSchema.ts';
import { showIdsResponseSchema } from '../../../_internal/response/showIdsResponseSchema.ts';
import { showResponseSchema } from '../../../_internal/response/showResponseSchema.ts';
import { z } from '../../../_internal/z.ts';

/**
 * A single entry in the mixed popular media feed: a movie OR a show, returned
 * unwrapped as one flat object with the shape-specific fields nullish.
 * Discriminate by shape (movies carry `released`, shows carry
 * `first_aired`/`aired_episodes`).
 */
export const mediaPopularResponseSchema = movieResponseSchema
  .merge(showResponseSchema)
  .extend({
    ids: showIdsResponseSchema,
    certification: z.string().nullish().describe(
      'Movie certifications and show certifications use different value sets.',
    ),
  });
