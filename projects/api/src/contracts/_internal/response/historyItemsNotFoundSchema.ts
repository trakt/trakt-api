import { historyItemsRequestSchema } from '../request/historyItemsRequestSchema.ts';

/**
 * Zod schema for the items a history write did not find. A season or episode missing
 * under a show echoes that show once per miss, holding only that season or
 * episode.
 */
export const historyItemsNotFoundSchema = historyItemsRequestSchema.extend({
  seasons: historyItemsRequestSchema.shape.shows,
  episodes: historyItemsRequestSchema.shape.shows,
});
