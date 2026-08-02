import { episodeResponseSchema } from '../../../_internal/response/episodeResponseSchema.ts';
import { z } from '../../../_internal/z.ts';

/** Zod schema for the watched episodes response. */
export const watchedEpisodesResponseSchema = z.array(z.object({
  plays: z.number().int(),
  last_watched_at: z.string().datetime(),
  last_updated_at: z.string().datetime(),
  episode: episodeResponseSchema,
}));
