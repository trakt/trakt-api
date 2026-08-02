import { movieResponseSchema } from '../../../_internal/response/movieResponseSchema.ts';
import { showResponseSchema } from '../../../_internal/response/showResponseSchema.ts';
import { z } from '../../../_internal/z.ts';

/**
 * A single entry in the mixed anticipated media feed: an anticipated movie OR
 * an anticipated show, as one flat object with the shape-specific fields
 * nullish. Discriminate by shape (movie entries carry `movie`, show entries
 * `show`).
 */
export const mediaAnticipatedResponseSchema = z.object({
  list_count: z.number().int(),
  movie: movieResponseSchema.nullish(),
  show: showResponseSchema.nullish(),
});
