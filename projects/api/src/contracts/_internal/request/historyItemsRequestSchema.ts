import { z } from '../z.ts';
import { mediaItemsRequestSchemaFactory } from './mediaItemsRequestSchemaFactory.ts';

/** Zod schema for the history items request. */
export const historyItemsRequestSchema = mediaItemsRequestSchemaFactory({
  watched_at: z
    .union([z.string().datetime(), z.enum(['released', 'unknown', 'now'])])
    .nullish()
    .openapi({
      description:
        'When the item was watched: a UTC datetime, `released` for its release date, `unknown` for no specific date, or `now` for the current time.',
    }),
});
