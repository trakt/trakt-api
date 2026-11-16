import { hiddenItemsRequestSchema } from '../request/hiddenItemsRequestSchema.ts';

/**
 * Zod schema for the items a hidden write did not find. A season or episode
 * missing under a show echoes that show once per miss, holding only that
 * season or episode.
 */
export const hiddenItemsNotFoundSchema = hiddenItemsRequestSchema.extend({
  seasons: hiddenItemsRequestSchema.shape.shows,
  episodes: hiddenItemsRequestSchema.shape.shows,
});
