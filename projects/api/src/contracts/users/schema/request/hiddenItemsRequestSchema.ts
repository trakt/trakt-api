import { mediaItemsRequestSchemaFactory } from '../../../_internal/request/mediaItemsRequestSchemaFactory.ts';
import { z } from '../../../_internal/z.ts';

/** Zod schema for the hidden items request. */
export const hiddenItemsRequestSchema = mediaItemsRequestSchemaFactory({
  hidden_at: z.string().datetime().nullish().openapi({
    description: 'When the item was hidden: a UTC datetime.',
  }),
})
  .omit({ episodes: true })
  .extend({
    users: z
      .array(
        z.object({
          ids: z.object({
            trakt: z
              .number()
              .int()
              .nullish()
              .openapi({ description: 'Trakt ID' }),
            slug: z.string().nullish().openapi({ description: 'Slug' }),
          }),
          hidden_at: z.string().datetime().nullish(),
        }),
      )
      .nullish(),
  });
