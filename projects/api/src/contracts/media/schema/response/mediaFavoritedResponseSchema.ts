import { movieResponseSchema } from '../../../_internal/response/movieResponseSchema.ts';
import { showResponseSchema } from '../../../_internal/response/showResponseSchema.ts';
import { z } from '../../../_internal/z.ts';

/**
 * A single entry in the mixed favorited media feed: a favorited movie OR a
 * favorited show, as one flat object with the shape-specific fields nullish.
 * Discriminate by shape (movie entries carry `movie`, show entries `show`).
 */
export const mediaFavoritedResponseSchema = z.object({
  user_count: z.number().int(),
  movie: movieResponseSchema.nullish(),
  show: showResponseSchema.nullish(),
});
