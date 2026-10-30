import { z } from '../z.ts';
import { mediaItemsRequestSchemaFactory } from './mediaItemsRequestSchemaFactory.ts';

/** Zod schema for the list items request. */
export const listRequestSchema = mediaItemsRequestSchemaFactory({
  notes: z.string().nullish().openapi({
    description:
      'Custom text for the list item, cut to 500 characters. Ignored unless the list owner is a Trakt VIP.',
  }),
});
