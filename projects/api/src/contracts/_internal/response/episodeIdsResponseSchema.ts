import { z } from '../z.ts';
import { streamingIdsResponseSchema } from './streamingIdsResponseSchema.ts';

export const episodeIdsResponseSchema = z.object({
  trakt: z.number().int(),
  tvdb: z.number().int().nullish(),
  imdb: z.string().nullish(),
  tmdb: z.number().int().nullish(),
  /**
   * Available if requesting extended `streaming_ids`.
   */
  plex: streamingIdsResponseSchema.nullish(),
});
