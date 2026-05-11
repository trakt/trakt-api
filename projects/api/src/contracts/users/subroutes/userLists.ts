import { builder } from '../../_internal/builder.ts';
import { extendedMediaQuerySchema } from '../../_internal/request/extendedMediaQuerySchema.ts';
import { extendedProfileQuerySchema } from '../../_internal/request/extendedProfileQuerySchema.ts';
import { limitlessQuerySchema } from '../../_internal/request/limitlessQuerySchema.ts';
import { listRequestSchema } from '../../_internal/request/listRequestSchema.ts';
import { mediaFilterParamsSchema } from '../../_internal/request/mediaFilterParamsSchema.ts';
import { pageQuerySchema } from '../../_internal/request/pageQuerySchema.ts';
import { sortQuerySchema } from '../../_internal/request/sortQuerySchema.ts';
import { commentResponseSchema } from '../../_internal/response/commentResponseSchema.ts';
import { likeResponseSchema } from '../../_internal/response/likeResponseSchema.ts';
import { listAddResponseSchema } from '../../_internal/response/listAddResponseSchema.ts';
import {
  listedAllResponseSchema,
  listedMediaResponseSchema,
} from '../../_internal/response/listedMediaResponseSchema.ts';
import { listedMovieResponseSchema } from '../../_internal/response/listedMovieResponseSchema.ts';
import { listedShowResponseSchema } from '../../_internal/response/listedShowResponseSchema.ts';
import { listRemoveResponseSchema } from '../../_internal/response/listRemoveResponseSchema.ts';
import { listResponseSchema } from '../../_internal/response/listResponseSchema.ts';
import { z } from '../../_internal/z.ts';
import { createListRequestSchema } from '../schema/request/createListRequestSchema.ts';
import { listCommentsSortParamsSchema } from '../schema/request/listCommentsSortParamsSchema.ts';
import { listParamsSchema } from '../schema/request/listParamsSchema.ts';
import { listUpdateRequestSchema } from '../schema/request/listUpdateRequestSchema.ts';
import { profileParamsSchema } from '../schema/request/profileParamsSchema.ts';
import { reorderRequestSchema } from '../schema/request/reorderRequestSchema.ts';
import { reorderListResponseSchema } from '../schema/response/reorderListResponseSchema.ts';
import { reorderListsResponseSchema } from '../schema/response/reorderListsResponseSchema.ts';
import { ignoreQuerySchema } from "../../_internal/request/ignoreQuerySchema.ts";

const list = builder.router({
  summary: {
    summary: 'Get personal list',
    description: `#### 🔓 OAuth Optional 😁 Emojis
Returns a single personal list. Use the [**/users/:id/lists/:list_id/items**](#reference/users/list-items) method to get the actual items this list contains.`,
    path: '/',
    method: 'GET',
    pathParams: profileParamsSchema.merge(listParamsSchema),
    query: extendedProfileQuerySchema,
    responses: {
      200: listResponseSchema,
    },
  },
  update: {
    summary: 'Update personal list',
    description: `#### 🔒 OAuth Required
Update a personal list by sending 1 or more parameters. If you update the list name, the original slug will still be retained so existing references to this list won't break.

#### Privacy

Lists will be \`private\` by default. Here is what each value means.

| Value | Privacy impact... |
|---|---|
| \`private\` | Only you can see the list. |
| \`link\` | Anyone with the \`share_link\` can see the list. |
| \`friends\` | Only your friends can see the list. |
| \`public\` | Anyone can see the list. |

#### JSON POST Data
| Key | Type | Value |
|---|---|---|---|
| \`name\` | string | Name of the list. |
| \`description\` | string | Description for this list. |
| \`privacy\` | string | \`private\`, \`link\`, \`friends\`, \`public\` |
| \`display_numbers\` | boolean | Should each item be numbered? |
| \`allow_comments\` | boolean | Are comments allowed? |
| \`sort_by\` | string | \`rank\`, \`added\`, \`title\`, \`released\`, \`runtime\`, \`popularity\`, \`random\`, \`percentage\`, \`imdb_rating\`, \`tmdb_rating\`, \`rt_tomatometer\`, \`rt_audience\`, \`metascore\`, \`votes\`, \`imdb_votes\`, \`tmdb_votes\`, \`my_rating\`, \`watched\`, \`collected\` |
| \`sort_how\` | string | \`asc\`, \`desc\` |`,
    path: '/',
    method: 'PUT',
    pathParams: profileParamsSchema.merge(listParamsSchema),
    body: listUpdateRequestSchema.merge(sortQuerySchema),
    responses: {
      200: listResponseSchema.array(),
    },
  },
  delete: {
    summary: "Delete a user's personal list",
    description: `#### 🔒 OAuth Required
Remove a personal list and all items it contains.`,
    path: '/',
    method: 'DELETE',
    pathParams: profileParamsSchema.merge(listParamsSchema),
    responses: {
      204: z.undefined(),
      403: z.undefined(),
    },
  },
  items: {
    movie: {
      summary: 'Get movie list items',
      description:
        `#### 🔓 OAuth Optional 📄 Pagination ✨ Extended Info 🎚 Filters
Returns movie items on a personal list. Use \`list_id\` to identify the list and query sorting, filters, and pagination to control the result set.`,
      path: '/items/movie',
      method: 'GET',
      pathParams: profileParamsSchema.merge(listParamsSchema),
      query: extendedMediaQuerySchema
        .merge(sortQuerySchema)
        .merge(mediaFilterParamsSchema)
        .merge(ignoreQuerySchema)
        .merge(pageQuerySchema)
        .merge(limitlessQuerySchema),
      responses: {
        200: listedMovieResponseSchema.array(),
      },
    },
    show: {
      summary: 'Get show list items',
      description:
        `#### 🔓 OAuth Optional 📄 Pagination ✨ Extended Info 🎚 Filters
Returns show items on a personal list. Use \`list_id\` to identify the list and query sorting, filters, and pagination to control the result set.`,
      path: '/items/show',
      method: 'GET',
      pathParams: profileParamsSchema.merge(listParamsSchema),
      query: extendedMediaQuerySchema
        .merge(sortQuerySchema)
        .merge(mediaFilterParamsSchema)
        .merge(ignoreQuerySchema)
        .merge(pageQuerySchema)
        .merge(limitlessQuerySchema),
      responses: {
        200: listedShowResponseSchema.array(),
      },
    },
    media: {
      summary: 'Get media list items',
      description:
        `#### 🔓 OAuth Optional 📄 Pagination ✨ Extended Info 🎚 Filters
Returns movie and show items on a personal list. Use \`list_id\` to identify the list and query sorting, filters, and pagination to control the result set.`,
      path: '/items/movie,show',
      method: 'GET',
      pathParams: profileParamsSchema
        .merge(listParamsSchema),
      query: extendedMediaQuerySchema
        .merge(sortQuerySchema)
        .merge(mediaFilterParamsSchema)
        .merge(ignoreQuerySchema)
        .merge(pageQuerySchema)
        .merge(limitlessQuerySchema),
      responses: {
        200: listedMediaResponseSchema.array(),
      },
    },
    all: {
      summary: 'Get all list items',
      description:
        `#### 🔓 OAuth Optional 📄 Pagination ✨ Extended Info 🎚 Filters
Returns movie, show, season, and episode items on a personal list. Use \`list_id\` to identify the list and query sorting, filters, and pagination to control the result set.`,
      path: '/items/movie,show,season,episode',
      method: 'GET',
      pathParams: profileParamsSchema
        .merge(listParamsSchema),
      query: extendedMediaQuerySchema
        .merge(sortQuerySchema)
        .merge(mediaFilterParamsSchema)
        .merge(ignoreQuerySchema)
        .merge(pageQuerySchema)
        .merge(limitlessQuerySchema),
      responses: {
        200: listedAllResponseSchema.array(),
      },
    },
  },
  add: {
    summary: 'Add items to personal list',
    description: `#### 🔥 VIP Enhanced 🔒 OAuth Required 😁 Emojis
Add one or more items to a personal list. Items can be movies, shows, seasons, episodes, or people.

#### Notes

Each list item can optionally accept a \`notes\` *(500 maximum characters)* field with custom text. The user must be a [**Trakt VIP**](https://trakt.tv/vip) to send \`notes\`.

#### Limits

If the user's list item limit is exceeded, a \`420\` HTTP error code is returned. Use the [**/users/settings**](/reference/users/settings) method to get all limits for a user account. In most cases, upgrading to [**Trakt VIP**](https://trakt.tv/vip) will increase the limits.

#### JSON POST Data
| Key | Type | Value |
|---|---|---|
| \`movies\` | array | Array of \`movie\` objects. (see examples ->) |
| \`shows\` | array | Array of \`show\` objects. |
| \`seasons\` | array | Array of \`season\` objects. |
| \`episodes\` | array | Array of \`episode\` objects. |
| \`people\` | array | Array of \`person\` objects. |`,
    path: '/items',
    method: 'POST',
    body: listRequestSchema,
    responses: {
      201: listAddResponseSchema,
      420: z.undefined(),
    },
  },
  remove: {
    summary: 'Remove items from personal list',
    description: `#### 🔒 OAuth Required
Remove one or more items from a personal list.

#### JSON POST Data
| Key | Type | Value |
|---|---|---|
| \`movies\` | array | Array of \`movie\` objects. (see examples ->) |
| \`shows\` | array | Array of \`show\` objects. |
| \`seasons\` | array | Array of \`season\` objects. |
| \`episodes\` | array | Array of \`episode\` objects. |
| \`people\` | array | Array of \`person\` objects. |`,
    path: '/items/remove',
    method: 'POST',
    body: listRequestSchema,
    responses: {
      200: listRemoveResponseSchema,
    },
  },
  reorder: {
    summary: 'Reorder items on a list',
    description: `#### 🔒 OAuth Required
Reorder items on a personal list. Send the ordered list item IDs in the request body; the response returns the updated item order.`,
    path: '/reorder',
    method: 'POST',
    pathParams: profileParamsSchema
      .merge(listParamsSchema),
    body: reorderRequestSchema,
    responses: {
      200: reorderListResponseSchema,
    },
  },
  likes: {
    summary: 'Get all users who liked a list',
    description: `#### 🔓 OAuth Optional 📄 Pagination
Returns all users who liked a list.`,
    path: '/likes',
    method: 'GET',
    pathParams: profileParamsSchema
      .merge(listParamsSchema),
    query: pageQuerySchema,
    responses: {
      200: likeResponseSchema.array(),
    },
  },
  comments: {
    summary: 'Get all list comments',
    description: `#### 🔓 OAuth Optional 📄 Pagination 😁 Emojis

Returns all top level comments for a list. By default, the comments are sorted by most \`likes\`. Other sorting options include \`likes_30\`, most \`replies\`, \`replies_30\`, most \`plays\`, highest \`rating\`, and \`added\` date.

> ### Note
> _If you send OAuth, comments from blocked users will be automatically filtered out._`,
    path: '/comments/:sort',
    method: 'GET',
    pathParams: profileParamsSchema
      .merge(listParamsSchema)
      .merge(listCommentsSortParamsSchema),
    query: pageQuerySchema,
    responses: {
      200: commentResponseSchema.array(),
    },
  },
}, {
  pathPrefix: '/:list_id',
});

export const userLists = builder.router({
  personal: {
    summary: "Get a user's personal lists",
    description: `#### 🔓 OAuth Optional 😁 Emojis
Returns all personal lists for a user. Use the [**/users/:id/lists/:list_id/items**](#reference/users/list-items) method to get the actual items a specific list contains.`,
    path: '',
    method: 'GET',
    pathParams: profileParamsSchema,
    query: extendedProfileQuerySchema
      .merge(pageQuerySchema),
    responses: {
      200: listResponseSchema.array(),
    },
  },
  collaborations: {
    summary: 'Get all lists a user can collaborate on',
    description: `#### 🔓 OAuth Optional
Returns all lists a user can collaborate on. This gives full access to add, remove, and re-order list items. It essentially works just like a list owned by the user, just make sure to use the correct list owner \`user\` when building the API URLs.`,
    path: '/collaborations',
    method: 'GET',
    pathParams: profileParamsSchema,
    query: extendedProfileQuerySchema,
    responses: {
      200: listResponseSchema.array(),
    },
  },
  reorder: {
    summary: "Reorder a user's lists",
    description: `#### 🔒 OAuth Required
Reorder all lists by sending the updated \`rank\` of list ids. Use the [**/users/:id/lists**](#reference/users/lists) method to get all list ids.`,
    path: '/reorder',
    method: 'POST',
    body: reorderRequestSchema,
    responses: {
      200: reorderListsResponseSchema,
    },
  },
  create: {
    summary: 'Create personal list',
    description: `#### 🔥 VIP Enhanced 🔒 OAuth Required
Create a new personal list. The \`name\` is the only required field, but the other info is recommended to ask for.

#### Limits

If the user's list limit is exceeded, a \`420\` HTTP error code is returned. Use the [**/users/settings**](/reference/users/settings) method to get all limits for a user account. In most cases, upgrading to [**Trakt VIP**](https://trakt.tv/vip) will increase the limits.

#### Privacy

Lists will be \`private\` by default. Here is what each value means.

| Value | Privacy impact... |
|---|---|
| \`private\` | Only you can see the list. |
| \`link\` | Anyone with the \`share_link\` can see the list. |
| \`friends\` | Only your friends can see the list. |
| \`public\` | Anyone can see the list. |

#### JSON POST Data
| Key | Type | Default | Value |
|---|---|---|---|
| \`name\` * | string |  | Name of the list. |
| \`description\` | string |  | Description for this list. |
| \`privacy\` | string | \`private\` | \`private\`, \`link\`, \`friends\`, \`public\` |
| \`display_numbers\` | boolean | \`false\` | Should each item be numbered? |
| \`allow_comments\` | boolean | \`true\` | Are comments allowed? |
| \`sort_by\` | string | \`rank\` | \`rank\`, \`added\`, \`title\`, \`released\`, \`runtime\`, \`popularity\`, \`random\`, \`percentage\`, \`imdb_rating\`, \`tmdb_rating\`, \`rt_tomatometer\`, \`rt_audience\`, \`metascore\`, \`votes\`, \`imdb_votes\`, \`tmdb_votes\`, \`my_rating\`, \`watched\`, \`collected\` |
| \`sort_how\` | string | \`asc\` | \`asc\`, \`desc\` |`,
    path: '',
    method: 'POST',
    body: createListRequestSchema,
    responses: {
      201: listResponseSchema,
    },
  },
  list,
}, {
  pathPrefix: '/:id/lists',
});

export type ReorderRequest = z.infer<typeof reorderRequestSchema>;
export type ReorderListsResponse = z.infer<typeof reorderListsResponseSchema>;
export type ReorderListResponseSchema = z.infer<
  typeof reorderListResponseSchema
>;

export type ListCommentsSortParams = z.infer<
  typeof listCommentsSortParamsSchema
>;
export type ListRequest = z.infer<typeof listRequestSchema>;
export type ListUpdateRequest = z.infer<typeof listUpdateRequestSchema>;

export type CreateListRequest = z.infer<typeof createListRequestSchema>;
