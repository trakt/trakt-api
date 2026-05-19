import { builder } from '../../_internal/builder.ts';
import { extendedQuerySchemaFactory } from '../../_internal/request/extendedQuerySchemaFactory.ts';
import { pageQuerySchema } from '../../_internal/request/pageQuerySchema.ts';
import { z } from '../../_internal/z.ts';
import { showQueryParamsSchema } from '../../shows/schema/request/showQueryParamsSchema.ts';
import { minimalParamSchema } from '../../sync/schema/request/minimalParamSchema.ts';
import { profileParamsSchema } from '../schema/request/profileParamsSchema.ts';
import { watchedMoviesMinimalResponseSchema } from '../schema/response/watchedMoviesMinimalResponseSchema.ts';
import { watchedMoviesResponseSchema } from '../schema/response/watchedMoviesResponseSchema.ts';
import { watchedShowsMinimalResponseSchema } from '../schema/response/watchedShowsMinimalResponseSchema.ts';
import { watchedShowsResponseSchema } from '../schema/response/watchedShowsResponseSchema.ts';

export const watched = builder.router({
  movies: {
    path: '/movies',
    method: 'GET',
    pathParams: profileParamsSchema,
    responses: {
      200: watchedMoviesResponseSchema,
    },
  },
  shows: {
    path: '/shows',
    method: 'GET',
    query: extendedQuerySchemaFactory<['noseasons']>().merge(
      showQueryParamsSchema,
    ),
    responses: {
      200: watchedShowsResponseSchema,
    },
  },
  minimal: builder.router({
    movies: {
      summary: 'Get watched movies',
      description: `#### 🔓 OAuth Optional 📄 Pagination ✨ Extended Info
Returns movies watched by a user in a minimal paginated format. Use \`extended\`, \`page\`, and \`limit\` to control the response.`,
      path: '/movies',
      method: 'GET',
      pathParams: profileParamsSchema,
      query: minimalParamSchema.merge(pageQuerySchema),
      responses: {
        200: watchedMoviesMinimalResponseSchema,
      },
    },
    shows: {
      summary: 'Get watched shows',
      description: `#### 🔓 OAuth Optional 📄 Pagination ✨ Extended Info
Returns shows watched by a user in a minimal paginated format. Use \`specials\` and \`season_numbers\` to control season details in the response.`,
      path: '/shows',
      method: 'GET',
      pathParams: profileParamsSchema,
      query: minimalParamSchema
        .merge(pageQuerySchema)
        .merge(
          showQueryParamsSchema.pick({ specials: true }),
        ).extend({
          season_numbers: z.boolean().nullish(),
        }),
      responses: {
        200: watchedShowsMinimalResponseSchema,
      },
    },
  }),
}, {
  pathPrefix: '/:id/watched',
});

export type WatchedMoviesResponse = z.infer<typeof watchedMoviesResponseSchema>;
export type WatchedShowsResponse = z.infer<typeof watchedShowsResponseSchema>;

export type WatchedMoviesMinimalResponse = z.infer<
  typeof watchedMoviesMinimalResponseSchema
>;

export type WatchedShowsMinimalResponse = z.infer<
  typeof watchedShowsMinimalResponseSchema
>;
