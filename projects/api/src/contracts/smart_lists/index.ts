import { builder } from '../_internal/builder.ts';
import { extendedMediaQuerySchema } from '../_internal/request/extendedMediaQuerySchema.ts';
import { ignoreQuerySchema } from '../_internal/request/ignoreQuerySchema.ts';
import { limitlessQuerySchema } from '../_internal/request/limitlessQuerySchema.ts';
import { mediaFilterParamsSchema } from '../_internal/request/mediaFilterParamsSchema.ts';
import { pageQuerySchema } from '../_internal/request/pageQuerySchema.ts';
import { smartListDefinitionResponseSchema } from '../_internal/response/smartListDefinitionResponseSchema.ts';
import { smartListItemResponseSchema } from '../_internal/response/smartListItemResponseSchema.ts';
import { z } from '../_internal/z.ts';
import { listParamsSchema } from '../users/schema/request/listParamsSchema.ts';

const listItemsPathParamsSchema = listParamsSchema.extend({
  type: z.string().describe('Smart list item type filter.'),
  sort_by: z.string().describe('Sort by a specific property.'),
  sort_how: z.string().describe('Sort direction.'),
});

/** ts-rest contract for the `smartLists` endpoints. */
export const smartLists = builder.router({
  summary: {
    summary: 'Get smart list',
    description: `#### 🔓 OAuth Optional 😁 Emojis
Returns a single smart list definition by its globally-unique slug. Use the [**/smart-lists/:list_id/items**](#reference/smart-lists) method to get the dynamic items this smart list resolves to.

> ### Note
> _Only public smart lists return data unless you send OAuth as the owner._`,
    path: '/:list_id',
    method: 'GET',
    pathParams: listParamsSchema,
    responses: {
      200: smartListDefinitionResponseSchema,
      404: z.undefined(),
    },
  },
  items: {
    summary: 'Get smart list items',
    description:
      `#### 🔓 OAuth Optional 📄 Pagination ✨ Extended Info 🎚 Filters 😁 Emojis
Returns the dynamic items a smart list resolves to. Use \`type\`, \`sort_by\`, and \`sort_how\` to control the returned item set and order, plus query filters and pagination to refine the result set.`,
    path: '/:list_id/items/:type/:sort_by/:sort_how',
    method: 'GET',
    pathParams: listItemsPathParamsSchema,
    query: extendedMediaQuerySchema
      .merge(mediaFilterParamsSchema)
      .merge(ignoreQuerySchema)
      .merge(pageQuerySchema)
      .merge(limitlessQuerySchema),
    responses: {
      200: smartListItemResponseSchema.array(),
    },
  },
}, {
  pathPrefix: '/smart-lists',
});

/** The smart list item response payload. */
export type SmartListItemResponse = z.infer<typeof smartListItemResponseSchema>;
