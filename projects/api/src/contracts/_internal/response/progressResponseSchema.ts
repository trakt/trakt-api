import { z } from '../z.ts';
import { episodeResponseSchema } from './episodeResponseSchema.ts';
import { statsResponseSchema } from './statsResponseSchema.ts';

export const progressResponseSchema = z.object({
  aired: z.number().int(),
  completed: z.number().int(),
  last_watched_at: z.string().datetime(),
  reset_at: z.null(),
  next_episode: episodeResponseSchema,
  last_episode: episodeResponseSchema.or(z.null()),
  /***
   * Available if requesting include_stats `true`.
   */
  stats: statsResponseSchema.nullish(),
});
