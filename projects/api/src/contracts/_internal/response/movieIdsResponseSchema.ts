import { z } from '../z.ts';
import { streamingIdsResponseSchema } from './streamingIdsResponseSchema.ts';

export const movieIdsResponseSchema = z.object({
  trakt: z.number().int(),
  slug: z.string(),
  imdb: z.string().nullable(),
  tmdb: z.number().int().optional(),
  /**
   * Available if requesting extended `streaming_ids`.
   */
  plex: streamingIdsResponseSchema.optional(),
});
