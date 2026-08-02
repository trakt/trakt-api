import { movieResponseSchema } from '../../../_internal/response/movieResponseSchema.ts';
import { showResponseSchema } from '../../../_internal/response/showResponseSchema.ts';
import { watchedStatsResponseSchema } from '../../../_internal/response/watchedStatsResponseSchema.ts';
import { z } from '../../../_internal/z.ts';

/**
 * A single entry in the mixed watched/played/collected media feed: a movie OR
 * a show, as one flat object with the shape-specific fields nullish.
 * `collector_count` is only present for shows. Discriminate by shape (movie
 * entries carry `movie`, show entries carry `show`).
 */
export const mediaWatchedResponseSchema = watchedStatsResponseSchema.extend({
  collector_count: z.number().int().nullish(),
  movie: movieResponseSchema.nullish(),
  show: showResponseSchema.nullish(),
});
