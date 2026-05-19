import { builder } from '../_internal/builder.ts';
import { extendedMediaQuerySchema } from '../_internal/request/extendedMediaQuerySchema.ts';
import { extendedProfileQuerySchema } from '../_internal/request/extendedProfileQuerySchema.ts';
import { extendedQuerySchemaFactory } from '../_internal/request/extendedQuerySchemaFactory.ts';
import { idParamsSchema } from '../_internal/request/idParamsSchema.ts';
import { limitlessQuerySchema } from '../_internal/request/limitlessQuerySchema.ts';
import { mediaFilterParamsSchema } from '../_internal/request/mediaFilterParamsSchema.ts';
import { pageQuerySchema } from '../_internal/request/pageQuerySchema.ts';
import { sortQuerySchema } from '../_internal/request/sortQuerySchema.ts';
import { likeResponseSchema } from '../_internal/response/likeResponseSchema.ts';
import {
  listedAllResponseSchema,
  listedMediaResponseSchema,
} from '../_internal/response/listedMediaResponseSchema.ts';
import { listedMovieResponseSchema } from '../_internal/response/listedMovieResponseSchema.ts';
import { listedShowResponseSchema } from '../_internal/response/listedShowResponseSchema.ts';
import { listResponseSchema } from '../_internal/response/listResponseSchema.ts';
import { z } from '../_internal/z.ts';
import { listReportRequestSchema } from './schema/listReportRequestSchema.ts';
import { prominentListResponseSchema } from './schema/prominentListResponseSchema.ts';

const ENTITY_LEVEL = builder.router({
  summary: {
    summary: 'Get list',
    description: `#### 😁 Emojis
Returns a single list. Use the [**/lists/:id/items**](#reference/lists/list-items) method to get the actual items this list contains.

> ### Note
> _You must use an integer \`id\`, and only public lists will return data._`,
    path: '',
    method: 'GET',
    pathParams: idParamsSchema,
    query: extendedProfileQuerySchema
      .merge(mediaFilterParamsSchema),
    responses: {
      200: listResponseSchema,
    },
  },
  items: {
    movie: {
      summary: 'Get movie list items',
      description: `#### 📄 Pagination ✨ Extended Info 🎚 Filters 😁 Emojis
Returns movie items on a public list. Use \`id\` to identify the list and query sorting, filters, and pagination to control the result set.`,
      path: '/items/movie',
      method: 'GET',
      pathParams: idParamsSchema,
      query: extendedMediaQuerySchema
        .merge(sortQuerySchema)
        .merge(mediaFilterParamsSchema)
        .merge(pageQuerySchema)
        .merge(limitlessQuerySchema),
      responses: {
        200: listedMovieResponseSchema.array(),
      },
    },
    show: {
      summary: 'Get show list items',
      description: `#### 📄 Pagination ✨ Extended Info 🎚 Filters 😁 Emojis
Returns show items on a public list. Use \`id\` to identify the list and query sorting, filters, and pagination to control the result set.`,
      path: '/items/show',
      method: 'GET',
      pathParams: idParamsSchema,
      query: extendedMediaQuerySchema
        .merge(sortQuerySchema)
        .merge(mediaFilterParamsSchema)
        .merge(pageQuerySchema)
        .merge(limitlessQuerySchema),
      responses: {
        200: listedShowResponseSchema.array(),
      },
    },
    media: {
      summary: 'Get media list items',
      description: `#### 📄 Pagination ✨ Extended Info 🎚 Filters 😁 Emojis
Returns movie and show items on a public list. Use \`id\` to identify the list and query sorting, filters, and pagination to control the result set.`,
      path: '/items/movie,show',
      method: 'GET',
      pathParams: idParamsSchema,
      query: extendedMediaQuerySchema
        .merge(sortQuerySchema)
        .merge(mediaFilterParamsSchema)
        .merge(pageQuerySchema)
        .merge(limitlessQuerySchema),
      responses: {
        200: listedMediaResponseSchema.array(),
      },
    },
    all: {
      summary: 'Get all list items',
      description: `#### 📄 Pagination ✨ Extended Info 🎚 Filters 😁 Emojis
Returns movie, show, episode, and season items on a public list. Use \`id\` to identify the list and query sorting, filters, and pagination to control the result set.`,
      path: '/items/movie,show,episode,season',
      method: 'GET',
      pathParams: idParamsSchema,
      query: extendedMediaQuerySchema
        .merge(sortQuerySchema)
        .merge(mediaFilterParamsSchema)
        .merge(pageQuerySchema)
        .merge(limitlessQuerySchema),
      responses: {
        200: listedAllResponseSchema.array(),
      },
    },
  },
  likes: {
    summary: 'Get all users who liked a list',
    description: `#### 📄 Pagination
Returns all users who liked a list.`,
    path: '/likes',
    method: 'GET',
    pathParams: idParamsSchema,
    query: extendedQuerySchemaFactory<['full']>()
      .merge(pageQuerySchema),
    responses: {
      200: likeResponseSchema.array(),
    },
  },
  like: {
    summary: 'Like a list',
    description: `#### 🔒 OAuth Required
Votes help determine popular lists. Only one like is allowed per list per user.`,
    path: '/like',
    method: 'POST',
    pathParams: idParamsSchema,
    body: z.undefined(),
    responses: {
      204: z.undefined(),
    },
  },
  unlike: {
    summary: 'Remove like on a list',
    description: `#### 🔒 OAuth Required
Remove a like on a list.`,
    path: '/like',
    method: 'DELETE',
    pathParams: idParamsSchema,
    responses: {
      204: z.undefined(),
    },
  },
  report: {
    summary: 'Report a list',
    description: `#### 🔒 OAuth Required
Report a list for moderator review. Send a \`reason\` and optional \`message\` with additional context. A user can only have one \`pending\` report per list.

| reason | description |
|---|---|
| \`duplicate\` | Duplicate of another list |
| \`remove\` | Should be removed from Trakt |
| \`metadata\` | Metadata is wrong (name, description, etc) |
| \`adult\` | Contains adult content |
| \`language\` | Not in English |
| \`spam\` | Spam or self-promotion |
| \`other\` | Anything else (add details in \`message\`) |`,
    path: '/report',
    method: 'POST',
    pathParams: idParamsSchema,
    body: listReportRequestSchema,
    responses: {
      201: z.undefined(),
      400: z.undefined(),
      409: z.undefined(),
    },
  },
}, {
  pathPrefix: '/:id',
});

const GLOBAL_LEVEL = builder.router({
  trending: {
    summary: 'Get trending lists',
    description: `#### 📄 Pagination ✨ Extended Info 🎚 Filters 😁 Emojis
Returns trending lists ordered by current activity. Use pagination and filters to control the result set.`,
    path: '/trending',
    method: 'GET',
    query: extendedQuerySchemaFactory<['full']>()
      .merge(pageQuerySchema)
      .merge(mediaFilterParamsSchema),
    responses: {
      200: prominentListResponseSchema.array(),
    },
  },
  popular: {
    summary: 'Get popular lists',
    description: `#### 📄 Pagination ✨ Extended Info 🎚 Filters 😁 Emojis
Returns popular lists ordered by long-term activity. Use pagination and filters to control the result set.`,
    path: '/popular',
    method: 'GET',
    query: extendedQuerySchemaFactory<['full']>()
      .merge(pageQuerySchema)
      .merge(mediaFilterParamsSchema),
    responses: {
      200: prominentListResponseSchema.array(),
    },
  },
});

export const lists = builder.router({
  ...GLOBAL_LEVEL,
  ...ENTITY_LEVEL,
}, {
  pathPrefix: '/lists',
});

export { prominentListResponseSchema };

export type ProminentListResponse = z.infer<typeof prominentListResponseSchema>;

export { listReportRequestSchema };
export type ListReportRequest = z.infer<typeof listReportRequestSchema>;
