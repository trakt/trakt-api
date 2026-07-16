import { episodeResponseSchema } from '../../../_internal/response/episodeResponseSchema.ts';
import { movieResponseSchema } from '../../../_internal/response/movieResponseSchema.ts';
import { showResponseSchema } from '../../../_internal/response/showResponseSchema.ts';
import { int64, z } from '../../../_internal/z.ts';
import { historyActionSchema } from './historyActionSchema.ts';

const historyBaseSchema = z.object({
  id: int64(z.number().int()),
  watched_at: z.string().datetime(),
  action: historyActionSchema,
});

const historyEpisodeSchema = z.object({
  type: z.literal('episode'),
  episode: episodeResponseSchema.nullish(),
  show: showResponseSchema.nullish(),
});

const historyMovieSchema = z.object({
  type: z.literal('movie'),
  movie: movieResponseSchema.nullish(),
});

/** Zod schema for the activity history response. */
export const activityHistoryResponseSchema = z.union([
  historyBaseSchema.merge(historyEpisodeSchema),
  historyBaseSchema.merge(historyMovieSchema),
]);
