import { movieResponseSchema } from '../../../_internal/response/movieResponseSchema.ts';
import { showResponseSchema } from '../../../_internal/response/showResponseSchema.ts';
import { z } from '../../../_internal/z.ts';

/**
 * A single entry in the mixed popular/next media feed: a movie OR a show, as
 * one flat object with the shape-specific fields nullish. Discriminate by shape
 * (movie entries carry `movie`, show entries `show`).
 */
export const mediaPopularNextResponseSchema = z.object({
  rank: z.number().int().nullable(),
  plays: z.number().int(),
  watchers: z.number().int(),
  movie: movieResponseSchema.nullish(),
  show: showResponseSchema.nullish(),
});
