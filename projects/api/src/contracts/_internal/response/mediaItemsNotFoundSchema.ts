import { mediaItemsRequestSchema } from '../request/mediaItemsRequestSchema.ts';

/**
 * Zod schema for the items a media items write did not find. A season or episode missing
 * under a show echoes that show once per miss, holding only that season or
 * episode.
 */
export const mediaItemsNotFoundSchema = mediaItemsRequestSchema.extend({
  seasons: mediaItemsRequestSchema.shape.shows,
  episodes: mediaItemsRequestSchema.shape.shows,
});
