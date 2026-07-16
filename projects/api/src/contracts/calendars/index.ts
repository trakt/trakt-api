import { builder } from '../_internal/builder.ts';
import { extendedMediaQuerySchema } from '../_internal/request/extendedMediaQuerySchema.ts';
import { ignoreQuerySchema } from '../_internal/request/ignoreQuerySchema.ts';
import { mediaFilterParamsSchema } from '../_internal/request/mediaFilterParamsSchema.ts';
import { z } from '../_internal/z.ts';
import { calendarRequestParamsSchema } from './schema/request/calendarParamsSchema.ts';
import { calendarMovieResponseSchema } from './schema/response/calendarMovieResponseSchema.ts';
import { calendarShowResponseSchema } from './schema/response/calendarShowListResponseSchema.ts';
import { hotReleaseResponseSchema } from './schema/response/hotReleaseResponseSchema.ts';

const groupQuery = z.object({
  group: z.enum(['day']).optional().openapi({
    description:
      'Collapse same-show-same-day episodes into a single card (`full_season` / `multiple_episodes`). Omit for one entry per episode.',
  }),
});

/** ts-rest contract for the `calendars` endpoints. */
export const calendars = builder.router({
  shows: {
    summary: 'Get shows',
    description: `#### ✨ Extended Info 🎚 Filters
Returns shows airing during the requested UTC date range. Use \`target\` to choose the authenticated user calendar (\`my\`) or the global calendar (\`all\`), and send \`start_date\` and \`days\` to define the window.`,
    method: 'GET',
    path: '/:target/shows/:start_date/:days',
    query: extendedMediaQuerySchema
      .merge(mediaFilterParamsSchema)
      .merge(ignoreQuerySchema)
      .merge(groupQuery),
    pathParams: calendarRequestParamsSchema,
    responses: {
      200: calendarShowResponseSchema.array(),
    },
  },
  newShows: {
    summary: 'Get new shows',
    description: `#### ✨ Extended Info 🎚 Filters
Returns new shows airing their first season during the requested UTC date range. Use \`target\` to choose the authenticated user calendar (\`my\`) or the global calendar (\`all\`).`,
    method: 'GET',
    path: '/:target/shows/new/:start_date/:days',
    query: extendedMediaQuerySchema
      .merge(mediaFilterParamsSchema)
      .merge(ignoreQuerySchema),
    pathParams: calendarRequestParamsSchema,
    responses: {
      200: calendarShowResponseSchema.array(),
    },
  },
  seasonPremieres: {
    summary: 'Get season premieres',
    description: `#### ✨ Extended Info 🎚 Filters
Returns season premieres airing during the requested UTC date range. Use \`target\` to choose the authenticated user calendar (\`my\`) or the global calendar (\`all\`).`,
    method: 'GET',
    path: '/:target/shows/premieres/:start_date/:days',
    query: extendedMediaQuerySchema
      .merge(mediaFilterParamsSchema)
      .merge(ignoreQuerySchema),
    pathParams: calendarRequestParamsSchema,
    responses: {
      200: calendarShowResponseSchema.array(),
    },
  },
  finales: {
    summary: 'Get finales',
    description: `#### ✨ Extended Info 🎚 Filters
Returns show finales airing during the requested UTC date range. Use \`target\` to choose the authenticated user calendar (\`my\`) or the global calendar (\`all\`).`,
    method: 'GET',
    path: '/:target/shows/finales/:start_date/:days',
    query: extendedMediaQuerySchema
      .merge(mediaFilterParamsSchema)
      .merge(ignoreQuerySchema),
    pathParams: calendarRequestParamsSchema,
    responses: {
      200: calendarShowResponseSchema.array(),
    },
  },
  movies: {
    summary: 'Get movies',
    description: `#### ✨ Extended Info 🎚 Filters
Returns movies with a release date during the requested UTC date range. Use \`target\` to choose the authenticated user calendar (\`my\`) or the global calendar (\`all\`).`,
    method: 'GET',
    path: '/:target/movies/:start_date/:days',
    query: extendedMediaQuerySchema
      .merge(mediaFilterParamsSchema)
      .merge(ignoreQuerySchema),
    pathParams: calendarRequestParamsSchema,
    responses: {
      200: calendarMovieResponseSchema.array(),
    },
  },
  streaming: {
    summary: 'Get streaming releases',
    description: `#### ✨ Extended Info 🎚 Filters
Returns all movies with a streaming release date during the requested UTC date range. Use \`target\` to choose the authenticated user calendar (\`my\`) or the global calendar (\`all\`).`,
    method: 'GET',
    path: '/:target/streaming/:start_date/:days',
    query: extendedMediaQuerySchema
      .merge(mediaFilterParamsSchema)
      .merge(ignoreQuerySchema),
    pathParams: calendarRequestParamsSchema,
    responses: {
      200: calendarMovieResponseSchema.array(),
    },
  },
  dvdReleases: {
    summary: 'Get DVD releases',
    description: `#### ✨ Extended Info 🎚 Filters
Returns DVD and physical media releases during the requested UTC date range. Use \`target\` to choose the authenticated user calendar (\`my\`) or the global calendar (\`all\`).`,
    method: 'GET',
    path: '/:target/dvd/:start_date/:days',
    query: extendedMediaQuerySchema
      .merge(mediaFilterParamsSchema)
      .merge(ignoreQuerySchema),
    pathParams: calendarRequestParamsSchema,
    responses: {
      200: calendarMovieResponseSchema.array(),
    },
  },
  media: {
    summary: 'Get media',
    description: `#### ✨ Extended Info 🎚 Filters
Returns the merged feed of movies and episodes during the requested UTC date range, ordered by availability date. Use \`target\` to choose the authenticated user calendar (\`my\`) or the global calendar (\`all\`), and \`type\` to narrow to a single media type.`,
    method: 'GET',
    path: '/:target/media/:start_date/:days',
    query: extendedMediaQuerySchema
      .merge(mediaFilterParamsSchema)
      .merge(z.object({
        type: z.enum(['movie', 'show']).optional().openapi({
          description:
            'Narrow the feed to a single media type. Omit to return both.',
        }),
      }))
      .merge(groupQuery),
    pathParams: calendarRequestParamsSchema,
    responses: {
      200: hotReleaseResponseSchema.array(),
    },
  },
  releasesHot: {
    summary: 'Get hot releases',
    description: `#### ✨ Extended Info 🎚 Filters
Returns the merged feed of upcoming movies and episodes during the requested UTC date range that are trending or highly anticipated, ordered by availability date. This is the global feed only; use \`type\` to narrow to a single media type.`,
    method: 'GET',
    path: '/releases/hot/:start_date/:days',
    query: extendedMediaQuerySchema
      .merge(mediaFilterParamsSchema)
      .merge(z.object({
        type: z.enum(['movie', 'show']).optional().openapi({
          description:
            'Narrow the feed to a single media type. Omit to return both.',
        }),
      }))
      .merge(groupQuery),
    pathParams: calendarRequestParamsSchema.omit({ target: true }),
    responses: {
      200: hotReleaseResponseSchema.array(),
    },
  },
  releasesHotPremieres: {
    summary: 'Get hot premieres',
    description: `#### ✨ Extended Info 🎚 Filters
Returns upcoming show premieres during the requested UTC date range that are trending or highly anticipated. Curated global feed - daily-cadence formats (soap, talk, news, game shows) and specials are excluded.`,
    method: 'GET',
    path: '/releases/hot/premieres/:start_date/:days',
    query: extendedMediaQuerySchema.merge(mediaFilterParamsSchema),
    pathParams: calendarRequestParamsSchema.omit({ target: true }),
    responses: {
      200: calendarShowResponseSchema.array(),
    },
  },
  releasesHotFinales: {
    summary: 'Get hot finales',
    description: `#### ✨ Extended Info 🎚 Filters
Returns upcoming show finales during the requested UTC date range that are trending or highly anticipated. Curated global feed - daily-cadence formats (soap, talk, news, game shows) and specials are excluded.`,
    method: 'GET',
    path: '/releases/hot/finales/:start_date/:days',
    query: extendedMediaQuerySchema.merge(mediaFilterParamsSchema),
    pathParams: calendarRequestParamsSchema.omit({ target: true }),
    responses: {
      200: calendarShowResponseSchema.array(),
    },
  },
  releasesHotNew: {
    summary: 'Get hot new shows',
    description: `#### ✨ Extended Info 🎚 Filters
Returns upcoming series premieres during the requested UTC date range that are trending or highly anticipated. Curated global feed - daily-cadence formats (soap, talk, news, game shows) and specials are excluded.`,
    method: 'GET',
    path: '/releases/hot/new/:start_date/:days',
    query: extendedMediaQuerySchema.merge(mediaFilterParamsSchema),
    pathParams: calendarRequestParamsSchema.omit({ target: true }),
    responses: {
      200: calendarShowResponseSchema.array(),
    },
  },
}, { pathPrefix: '/calendars' });

export { calendarRequestParamsSchema };
/** The calendar parameters. */
export type CalendarParams = z.infer<typeof calendarRequestParamsSchema>;

export { calendarShowResponseSchema };
/** The calendar show response payload. */
export type CalendarShowResponse = z.infer<
  typeof calendarShowResponseSchema
>;

export { calendarMovieResponseSchema };
/** The calendar movie response payload. */
export type CalendarMovieResponse = z.infer<typeof calendarMovieResponseSchema>;

export { hotReleaseResponseSchema };
/** The hot release response payload. */
export type HotReleaseResponse = z.infer<typeof hotReleaseResponseSchema>;
