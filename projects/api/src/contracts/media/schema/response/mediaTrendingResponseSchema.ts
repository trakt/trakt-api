import { movieResponseSchema } from '../../../_internal/response/movieResponseSchema.ts';
import { showResponseSchema } from '../../../_internal/response/showResponseSchema.ts';
import { z } from '../../../_internal/z.ts';

/**
 * A single entry in the mixed trending media feed: a trending movie OR a
 * trending show, as one flat object with the shape-specific fields nullish.
 * Discriminate by shape (movie entries carry `movie`, show entries `show`).
 */
export const mediaTrendingResponseSchema = z.object({
  watchers: z.number().int(),
  movie: movieResponseSchema.nullish(),
  show: showResponseSchema.nullish(),
});
