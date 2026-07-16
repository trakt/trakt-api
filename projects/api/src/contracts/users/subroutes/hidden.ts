import { builder } from '../../_internal/builder.ts';
import { bulkMediaRequestSchema } from '../../_internal/request/bulkMediaRequestSchema.ts';
import { extendedQuerySchemaFactory } from '../../_internal/request/extendedQuerySchemaFactory.ts';
import { pageQuerySchema } from '../../_internal/request/pageQuerySchema.ts';
import { z } from '../../_internal/z.ts';
import { hiddenParamsSchema } from '../schema/request/hiddenParamsSchema.ts';
import { hiddenShowRequestSchema } from '../schema/request/hiddenShowRequestSchema.ts';
import { hiddenAddResponseSchema } from '../schema/response/hiddenAddResponseSchema.ts';
import { hiddenRemoveResponseSchema } from '../schema/response/hiddenRemoveResponseSchema.ts';
import { hiddenShowResponseSchema } from '../schema/response/hiddenShowResponseSchema.ts';

const hiddenTypeQuerySchema = z.object({
  type: z.string().optional().describe('Hidden item type filter.'),
});

/** ts-rest contract for the `hidden` endpoints. */
export const hidden = builder.router({
  add: {
    summary: 'Add hidden items',
    description: `#### 🔒 OAuth Required
Hide items for a specific section. Here's what type of items can hidden for each section. You can optionally specify the \`hidden_at\` date for each item.

#### Hideable Media Objects
| Section | Objects |
|---|---|---|
| \`calendar\` | \`movie\`, \`show\` |
| \`progress_watched\` | \`show\`, \`season\` |
| \`progress_collected\` | \`show\`, \`season\` |
| \`recommendations\` | \`movie\`, \`show\` |
| \`comments\` | \`user\` |
| \`dropped\` | \`show\` |

#### JSON POST Data
| Key | Type | Value |
|---|---|---|
| \`movies\` | array | Array of \`movie\` objects. (see examples ->) |
| \`shows\` | array | Array of \`show\` objects. |
| \`seasons\` | array | Array of \`season\` objects. |
| \`users\` | array | Array of \`user\` objects. |`,
    path: '/:section',
    pathParams: hiddenParamsSchema,
    method: 'POST',
    body: bulkMediaRequestSchema,
    responses: {
      200: hiddenAddResponseSchema,
    },
  },
  get: {
    summary: 'Get hidden progress items',
    description: `#### 🔒 OAuth Required 📄 Pagination ✨ Extended Info
Returns shows hidden from watched progress for the authenticated user. Use \`type\`, \`page\`, and \`limit\` to filter and paginate the hidden items.`,
    path: '/progress_watched',
    method: 'GET',
    query: extendedQuerySchemaFactory<['full', 'images']>()
      .merge(pageQuerySchema)
      .merge(hiddenShowRequestSchema),
    responses: {
      200: hiddenShowResponseSchema.array(),
    },
  },
  getBySection: {
    summary: 'Get hidden items',
    description: `#### 🔒 OAuth Required 📄 Pagination ✨ Extended Info
Returns hidden items for a specific section. Use \`type\`, \`page\`, and \`limit\` to filter and paginate the hidden items.`,
    path: '/:section',
    method: 'GET',
    pathParams: hiddenParamsSchema,
    query: extendedQuerySchemaFactory<['full', 'images']>()
      .merge(pageQuerySchema)
      .merge(hiddenTypeQuerySchema),
    responses: {
      200: hiddenShowResponseSchema.array(),
    },
  },
  dropped: {
    summary: 'Get dropped shows',
    description: `#### 🔒 OAuth Required 📄 Pagination ✨ Extended Info
Returns shows the authenticated user has dropped or hidden from progress. Use pagination to move through the hidden dropped list.`,
    path: '/dropped',
    method: 'GET',
    query: extendedQuerySchemaFactory<['full', 'images']>()
      .merge(pageQuerySchema),
    responses: { 200: hiddenShowResponseSchema.array() },
  },
  remove: {
    progress: {
      summary: 'Remove hidden progress items',
      description: `#### 🔒 OAuth Required
Remove shows or seasons from hidden watched progress. Send hideable media objects in the request body; the response contains remove counts.`,
      path: '/progress_watched/remove',
      method: 'POST',
      body: bulkMediaRequestSchema,
      responses: {
        200: hiddenRemoveResponseSchema,
      },
    },
    calendar: {
      summary: 'Remove hidden calendar items',
      description: `#### 🔒 OAuth Required
Remove movies or shows from hidden calendar items. Send hideable media objects in the request body; the response contains remove counts.`,
      path: '/calendar/remove',
      method: 'POST',
      body: bulkMediaRequestSchema,
      responses: {
        200: hiddenRemoveResponseSchema,
      },
    },
    section: {
      summary: 'Remove hidden items',
      description: `#### 🔒 OAuth Required
Remove hidden items for a specific section. Send hideable media objects in the request body; the response contains remove counts.`,
      path: '/:section/remove',
      method: 'POST',
      pathParams: hiddenParamsSchema,
      body: bulkMediaRequestSchema,
      responses: {
        200: hiddenRemoveResponseSchema,
      },
    },
  },
}, {
  pathPrefix: '/hidden',
});

/** The hidden show item response payload. */
export type HiddenShowItemResponse = z.infer<
  typeof hiddenShowResponseSchema
>;
/** The hidden media request payload. */
export type HiddenMediaRequest = z.infer<typeof bulkMediaRequestSchema>;
