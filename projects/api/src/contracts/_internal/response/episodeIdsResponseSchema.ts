import { z } from '../z.ts';
import { streamingIdsResponseSchema } from './streamingIdsResponseSchema.ts';

export const episodeIdsResponseSchema = z.object({
  trakt: z.number().int(),
  tvdb: z.number().int(),
  imdb: z.string().nullable(),
  tmdb: z.number().int(),
  /**
   * Available if requesting extended `streaming_ids`.
   */
  plex: streamingIdsResponseSchema.optional(),
});
