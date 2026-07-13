import { z } from '../../../_internal/z.ts';
import { calendarMovieResponseSchema } from './calendarMovieResponseSchema.ts';
import { calendarShowResponseSchema } from './calendarShowListResponseSchema.ts';

/**
 * A single entry in the merged hot-releases feed: either an upcoming movie or
 * an upcoming episode. Discriminate by shape — movie entries carry `movie`,
 * episode entries carry `episode`/`show`.
 */
export const hotReleaseResponseSchema = z.union([
  calendarMovieResponseSchema,
  calendarShowResponseSchema,
]);
