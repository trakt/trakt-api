import { movieResponseSchema } from '../../../_internal/response/movieResponseSchema.ts';
import { watchedStatsResponseSchema } from '../../../_internal/response/watchedStatsResponseSchema.ts';

export const movieWatchedResponseSchema = watchedStatsResponseSchema.extend({
  movie: movieResponseSchema,
});
