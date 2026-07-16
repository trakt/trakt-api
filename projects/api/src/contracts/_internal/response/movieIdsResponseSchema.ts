import { z } from '../z.ts';
import { streamingIdsResponseSchema } from './streamingIdsResponseSchema.ts';

/** Zod schema for the movie ids response. */
export const movieIdsResponseSchema = z.object({
  trakt: z.number().int(),
  slug: z.string(),
  imdb: z.string().nullish(),
  tmdb: z.number().int().nullish(),
  /**
   * Available if requesting extended `streaming_ids`.
   */
  plex: streamingIdsResponseSchema.nullish(),
});
