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

const SEVERITY_RANGE =
  'Parental guide severity range `min-max`, from 0 (none) to 3 (severe).';

const smartListItemsQuerySchema = extendedMediaQuerySchema
  .merge(mediaFilterParamsSchema.omit({
    start_date: true,
    end_date: true,
  }))
  .merge(ignoreQuerySchema.omit({ ignore_collected: true }))
  .merge(pageQuerySchema)
  .merge(limitlessQuerySchema)
  .extend({
    watchnow_country: z.string().optional().describe(
      'Two-letter region for `watchnow`. Defaults to the list region, then the owner region, then `us`.',
    ),
    parental_nudity: z.string().optional().describe(SEVERITY_RANGE),
    parental_violence: z.string().optional().describe(SEVERITY_RANGE),
    parental_profanity: z.string().optional().describe(SEVERITY_RANGE),
    parental_alcohol: z.string().optional().describe(SEVERITY_RANGE),
    parental_frightening: z.string().optional().describe(SEVERITY_RANGE),
    parental_include_unrated: z.boolean().optional().describe(
      'Keep titles without a parental guide when a parental range is set. Defaults to `false`.',
    ),
  });

const smartListItemsPathParamsSchema = listParamsSchema.extend({
  type: z.string().describe(
    '`all`, `movies` or `shows`. Narrows a list holding both media types.',
  ),
  sort_by: z.string().describe(
    '`rank` (default, the source order), `random`, `title`, `released`, `runtime`, `percentage`, `votes`, `imdb_rating`, `imdb_votes`, `tmdb_rating`, `tmdb_votes`, `rt_tomatometer`, `rt_audience`, `metascore`. Watchlist lists also take `added`. Recommendation lists always use `rank`. Unknown values fall back to `rank`.',
  ),
  sort_how: z.string().describe(
    '`asc` or `desc`. Defaults to `asc` for `rank` and `title`, `desc` otherwise.',
  ),
});

const ITEMS_DESCRIPTION =
  `Returns the dynamic items a smart list resolves to, worked out when you request them. A list can hold movies, shows, or both. Use query filters and pagination to refine the result set.

Streaming (\`watchnow\`) filters resolve against the list owner, not the caller: the list region, else the owner's region, else \`us\`, and \`favorites\` means the owner's services.`;

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
${ITEMS_DESCRIPTION}`,
    path: '/:list_id/items',
    method: 'GET',
    pathParams: listParamsSchema,
    query: smartListItemsQuerySchema,
    responses: {
      200: smartListItemResponseSchema.array(),
    },
  },
  typedSorted: {
    summary: 'Get smart list items by type and sort',
    description:
      `#### 🔓 OAuth Optional 📄 Pagination ✨ Extended Info 🎚 Filters 😁 Emojis
${ITEMS_DESCRIPTION}

Use \`type\` to narrow a list holding both media types, and \`sort_by\` / \`sort_how\` to reorder it. A sorted list holding both media types is merged into one order across pages.`,
    path: '/:list_id/items/:type/:sort_by/:sort_how',
    method: 'GET',
    pathParams: smartListItemsPathParamsSchema,
    query: smartListItemsQuerySchema,
    responses: {
      200: smartListItemResponseSchema.array(),
    },
  },
}, {
  pathPrefix: '/smart-lists',
});

/** The smart list item response payload. */
export type SmartListItemResponse = z.infer<typeof smartListItemResponseSchema>;
