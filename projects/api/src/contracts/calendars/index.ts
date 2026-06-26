import { builder } from '../_internal/builder.ts';
import { extendedMediaQuerySchema } from '../_internal/request/extendedMediaQuerySchema.ts';
import { ignoreQuerySchema } from '../_internal/request/ignoreQuerySchema.ts';
import { mediaFilterParamsSchema } from '../_internal/request/mediaFilterParamsSchema.ts';
import type { z } from '../_internal/z.ts';
import { calendarRequestParamsSchema } from './schema/request/calendarParamsSchema.ts';
import { calendarMovieResponseSchema } from './schema/response/calendarMovieResponseSchema.ts';
import { calendarShowResponseSchema } from './schema/response/calendarShowListResponseSchema.ts';

export const calendars = builder.router({
  shows: {
    summary: 'Get shows',
    description: `#### ✨ Extended Info 🎚 Filters
Returns shows airing during the requested UTC date range. Use \`target\` to choose the authenticated user calendar (\`my\`) or the global calendar (\`all\`), and send \`start_date\` and \`days\` to define the window.`,
    method: 'GET',
    path: '/:target/shows/:start_date/:days',
    query: extendedMediaQuerySchema
      .merge(mediaFilterParamsSchema)
      .merge(ignoreQuerySchema),
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
}, { pathPrefix: '/calendars' });

export { calendarRequestParamsSchema };
export type CalendarParams = z.infer<typeof calendarRequestParamsSchema>;

export { calendarShowResponseSchema };
export type CalendarShowResponse = z.infer<
  typeof calendarShowResponseSchema
>;

export { calendarMovieResponseSchema };
export type CalendarMovieResponse = z.infer<typeof calendarMovieResponseSchema>;
