import { movieResponseSchema } from '../../../_internal/response/movieResponseSchema.ts';
import { watchedStatsResponseSchema } from '../../../_internal/response/watchedStatsResponseSchema.ts';

/** Zod schema for the movie watched response. */
export const movieWatchedResponseSchema = watchedStatsResponseSchema.extend({
  movie: movieResponseSchema,
});
