import { z } from '../z.ts';
import { streamingIdsResponseSchema } from './streamingIdsResponseSchema.ts';

export const episodeIdsResponseSchema = z.object({
  trakt: z.number().int(),
  tvdb: z.number().int().optional(),
  imdb: z.string().nullable(),
  tmdb: z.number().int().optional(),
  /**
   * Available if requesting extended `streaming_ids`.
   */
  plex: streamingIdsResponseSchema.optional(),
});
