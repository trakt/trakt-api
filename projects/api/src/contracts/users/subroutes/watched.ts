import { builder } from '../../_internal/builder.ts';
import { extendedQuerySchemaFactory } from '../../_internal/request/extendedQuerySchemaFactory.ts';
import { pageQuerySchema } from '../../_internal/request/pageQuerySchema.ts';
import { movieIdsResponseSchema } from '../../_internal/response/movieIdsResponseSchema.ts';
import { showIdsResponseSchema } from '../../_internal/response/showIdsResponseSchema.ts';
import { z } from '../../_internal/z.ts';
import { showQueryParamsSchema } from '../../shows/schema/request/showQueryParamsSchema.ts';
import { minimalParamSchema } from '../../sync/schema/request/minimalParamSchema.ts';
import { dateRangeParamsSchema } from '../schema/request/dateRangeParamsSchema.ts';
import { profileParamsSchema } from '../schema/request/profileParamsSchema.ts';
import { watchedEpisodesMinimalResponseSchema } from '../schema/response/watchedEpisodesMinimalResponseSchema.ts';
import { watchedEpisodesResponseSchema } from '../schema/response/watchedEpisodesResponseSchema.ts';
import { watchedMoviesMinimalResponseSchema } from '../schema/response/watchedMoviesMinimalResponseSchema.ts';
import { watchedMoviesResponseSchema } from '../schema/response/watchedMoviesResponseSchema.ts';
import { watchedShowsMinimalResponseSchema } from '../schema/response/watchedShowsMinimalResponseSchema.ts';
import { watchedShowsResponseSchema } from '../schema/response/watchedShowsResponseSchema.ts';

const watchedTypeParamsSchema = profileParamsSchema.extend({
  type: z.string().describe('Watched media type filter.'),
});

/**
 * A single `/:id/watched/:type` entry: a watched movie or a watched show, as
 * one flat object with the shape-specific fields nullish. Discriminate by
 * which of `movie` / `show` is present.
 */
const watchedTypedResponseSchema = z.array(z.object({
  plays: z.number().int(),
  last_watched_at: z.string().datetime(),
  last_updated_at: z.string().datetime(),
  reset_at: z.string().datetime().nullish(),
  movie: z.object({
    title: z.string(),
    year: z.number().int(),
    ids: movieIdsResponseSchema,
  }).nullish(),
  show: z.object({
    aired_episodes: z.number().int(),
    title: z.string(),
    year: z.number().int().nullish(),
    ids: showIdsResponseSchema,
  }).nullish(),
  seasons: z.array(
    z.object({
      number: z.number().int(),
      episodes: z.array(
        z.object({
          number: z.number().int(),
          plays: z.number().int(),
          last_watched_at: z.string().datetime(),
        }),
      ),
    }),
  ).nullish(),
}));

/** ts-rest contract for the `watched` endpoints. */
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
  episodes: {
    summary: 'Get watched episodes',
    description: `#### 🔓 OAuth Optional 📄 Pagination ✨ Extended Info
Returns episodes watched by a user, sorted by most recently watched. Use \`specials\` and \`start_at\`/\`end_at\` to filter.`,
    path: '/episodes',
    method: 'GET',
    pathParams: profileParamsSchema,
    query: extendedQuerySchemaFactory<['full', 'images']>()
      .merge(pageQuerySchema)
      .merge(dateRangeParamsSchema)
      .merge(showQueryParamsSchema.pick({ specials: true }))
      .extend({
        translations: z.string().nullish().openapi({
          description:
            'Two-letter language code; returns episode titles translated into that language.',
        }),
      }),
    responses: {
      200: watchedEpisodesResponseSchema,
    },
  },
  typed: {
    summary: 'Get watched',
    description: `#### 🔓 OAuth Optional ✨ Extended Info
Returns all movies or shows a user has watched sorted by most recently watched.`,
    path: '/:type',
    method: 'GET',
    pathParams: watchedTypeParamsSchema,
    query: extendedQuerySchemaFactory<['noseasons']>().merge(
      showQueryParamsSchema,
    ),
    responses: {
      200: watchedTypedResponseSchema,
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
    episodes: {
      summary: 'Get watched episodes',
      description: `#### 🔓 OAuth Optional 📄 Pagination ✨ Extended Info
Returns episodes watched by a user in a minimal paginated format. Use \`specials\` to control season detail.`,
      path: '/episodes',
      method: 'GET',
      pathParams: profileParamsSchema,
      query: minimalParamSchema
        .merge(pageQuerySchema)
        .merge(dateRangeParamsSchema)
        .merge(showQueryParamsSchema.pick({ specials: true })),
      responses: {
        200: watchedEpisodesMinimalResponseSchema,
      },
    },
  }),
}, {
  pathPrefix: '/:id/watched',
});

/** The watched movies response payload. */
export type WatchedMoviesResponse = z.infer<typeof watchedMoviesResponseSchema>;
/** The watched shows response payload. */
export type WatchedShowsResponse = z.infer<typeof watchedShowsResponseSchema>;

/** The watched movies minimal response payload. */
export type WatchedMoviesMinimalResponse = z.infer<
  typeof watchedMoviesMinimalResponseSchema
>;

/** The watched shows minimal response payload. */
export type WatchedShowsMinimalResponse = z.infer<
  typeof watchedShowsMinimalResponseSchema
>;

/** The watched episodes response payload. */
export type WatchedEpisodesResponse = z.infer<
  typeof watchedEpisodesResponseSchema
>;

/** The watched episodes minimal response payload. */
export type WatchedEpisodesMinimalResponse = z.infer<
  typeof watchedEpisodesMinimalResponseSchema
>;
