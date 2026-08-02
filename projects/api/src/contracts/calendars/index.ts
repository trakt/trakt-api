import { authMetadata, builder } from '../_internal/builder.ts';
import { extendedMediaQuerySchema } from '../_internal/request/extendedMediaQuerySchema.ts';
import { mediaFilterParamsSchema } from '../_internal/request/mediaFilterParamsSchema.ts';
import { z } from '../_internal/z.ts';
import { calendarRequestParamsSchema } from './schema/request/calendarParamsSchema.ts';
import { calendarMovieResponseSchema } from './schema/response/calendarMovieResponseSchema.ts';
import { calendarShowResponseSchema } from './schema/response/calendarShowListResponseSchema.ts';
import { hotReleaseResponseSchema } from './schema/response/hotReleaseResponseSchema.ts';

const calendarFilterParamsSchema = mediaFilterParamsSchema.omit({
  years: true,
  networks: true,
  keywords: true,
  keywords_operator: true,
  genres_operator: true,
  letterboxd_ratings: true,
  mal_ratings: true,
});

const groupQuery = z.object({
  group: z.enum(['day']).optional().openapi({
    description:
      'Collapse same-show-same-day episodes into a single card (`full_season` / `multiple_episodes`). Omit for one entry per episode.',
  }),
});

const mediaTypeQuery = z.object({
  type: z.enum(['movie', 'show']).optional().openapi({
    description: 'Narrow the feed to a single media type. Omit to return both.',
  }),
});

const defaultRangeParams = calendarRequestParamsSchema.omit({
  start_date: true,
  days: true,
});

const ungatedRangeParams = calendarRequestParamsSchema.omit({ target: true });

/** ts-rest contract for the `calendars` endpoints. */
export const calendars = builder.router({
  shows: {
    summary: 'Get shows',
    description: `#### ✨ Extended Info 🎚 Filters
Returns shows airing during the requested UTC date range. Use \`target\` to choose the authenticated user calendar (\`my\`) or the global calendar (\`all\`), and send \`start_date\` and \`days\` to define the window.`,
    method: 'GET',
    path: '/:target/shows/:start_date/:days',
    query: extendedMediaQuerySchema
      .merge(calendarFilterParamsSchema)
      .merge(groupQuery),
    pathParams: calendarRequestParamsSchema,
    responses: {
      200: calendarShowResponseSchema.array(),
    },
  },
  showsDefault: {
    summary: 'Get shows',
    description: `#### ✨ Extended Info 🎚 Filters
Same as \`shows\`, but omits \`start_date\` and \`days\` from the path - defaults to today and a 7-day window.`,
    method: 'GET',
    path: '/:target/shows',
    query: extendedMediaQuerySchema
      .merge(calendarFilterParamsSchema)
      .merge(groupQuery),
    pathParams: defaultRangeParams,
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
      .merge(calendarFilterParamsSchema)
      .merge(groupQuery),
    pathParams: calendarRequestParamsSchema,
    responses: {
      200: calendarShowResponseSchema.array(),
    },
  },
  newShowsDefault: {
    summary: 'Get new shows',
    description: `#### ✨ Extended Info 🎚 Filters
Same as \`newShows\`, but omits \`start_date\` and \`days\` from the path - defaults to today and a 7-day window.`,
    method: 'GET',
    path: '/:target/shows/new',
    query: extendedMediaQuerySchema
      .merge(calendarFilterParamsSchema)
      .merge(groupQuery),
    pathParams: defaultRangeParams,
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
      .merge(calendarFilterParamsSchema)
      .merge(groupQuery),
    pathParams: calendarRequestParamsSchema,
    responses: {
      200: calendarShowResponseSchema.array(),
    },
  },
  seasonPremieresDefault: {
    summary: 'Get season premieres',
    description: `#### ✨ Extended Info 🎚 Filters
Same as \`seasonPremieres\`, but omits \`start_date\` and \`days\` from the path - defaults to today and a 7-day window.`,
    method: 'GET',
    path: '/:target/shows/premieres',
    query: extendedMediaQuerySchema
      .merge(calendarFilterParamsSchema)
      .merge(groupQuery),
    pathParams: defaultRangeParams,
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
      .merge(calendarFilterParamsSchema)
      .merge(groupQuery),
    pathParams: calendarRequestParamsSchema,
    responses: {
      200: calendarShowResponseSchema.array(),
    },
  },
  finalesDefault: {
    summary: 'Get finales',
    description: `#### ✨ Extended Info 🎚 Filters
Same as \`finales\`, but omits \`start_date\` and \`days\` from the path - defaults to today and a 7-day window.`,
    method: 'GET',
    path: '/:target/shows/finales',
    query: extendedMediaQuerySchema
      .merge(calendarFilterParamsSchema)
      .merge(groupQuery),
    pathParams: defaultRangeParams,
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
      .merge(calendarFilterParamsSchema),
    pathParams: calendarRequestParamsSchema,
    responses: {
      200: calendarMovieResponseSchema.array(),
    },
  },
  moviesDefault: {
    summary: 'Get movies',
    description: `#### ✨ Extended Info 🎚 Filters
Same as \`movies\`, but omits \`start_date\` and \`days\` from the path - defaults to today and a 7-day window.`,
    method: 'GET',
    path: '/:target/movies',
    query: extendedMediaQuerySchema
      .merge(calendarFilterParamsSchema),
    pathParams: defaultRangeParams,
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
      .merge(calendarFilterParamsSchema),
    pathParams: calendarRequestParamsSchema,
    responses: {
      200: calendarMovieResponseSchema.array(),
    },
  },
  streamingDefault: {
    summary: 'Get streaming releases',
    description: `#### ✨ Extended Info 🎚 Filters
Same as \`streaming\`, but omits \`start_date\` and \`days\` from the path - defaults to today and a 7-day window.`,
    method: 'GET',
    path: '/:target/streaming',
    query: extendedMediaQuerySchema
      .merge(calendarFilterParamsSchema),
    pathParams: defaultRangeParams,
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
      .merge(calendarFilterParamsSchema),
    pathParams: calendarRequestParamsSchema,
    responses: {
      200: calendarMovieResponseSchema.array(),
    },
  },
  dvdReleasesDefault: {
    summary: 'Get DVD releases',
    description: `#### ✨ Extended Info 🎚 Filters
Same as \`dvdReleases\`, but omits \`start_date\` and \`days\` from the path - defaults to today and a 7-day window.`,
    method: 'GET',
    path: '/:target/dvd',
    query: extendedMediaQuerySchema
      .merge(calendarFilterParamsSchema),
    pathParams: defaultRangeParams,
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
      .merge(calendarFilterParamsSchema)
      .merge(mediaTypeQuery)
      .merge(groupQuery),
    pathParams: calendarRequestParamsSchema,
    responses: {
      200: hotReleaseResponseSchema.array(),
    },
  },
  mediaDefault: {
    summary: 'Get media',
    description: `#### ✨ Extended Info 🎚 Filters
Same as \`media\`, but omits \`start_date\` and \`days\` from the path - defaults to today and a 7-day window.`,
    method: 'GET',
    path: '/:target/media',
    query: extendedMediaQuerySchema
      .merge(calendarFilterParamsSchema)
      .merge(mediaTypeQuery)
      .merge(groupQuery),
    pathParams: defaultRangeParams,
    responses: {
      200: hotReleaseResponseSchema.array(),
    },
  },
  moviesAuto: {
    summary: 'Get movies',
    description: `#### 🔓 OAuth Optional ✨ Extended Info 🎚 Filters
Returns movies with a release date during the requested UTC date range. No \`target\` segment - returns the authenticated user's calendar when a token is sent, otherwise the global calendar.`,
    method: 'GET',
    path: '/movies/:start_date/:days',
    query: extendedMediaQuerySchema
      .merge(calendarFilterParamsSchema),
    pathParams: ungatedRangeParams,
    responses: {
      200: calendarMovieResponseSchema.array(),
    },
    metadata: authMetadata('optional'),
  },
  moviesAutoDefault: {
    summary: 'Get movies',
    description: `#### 🔓 OAuth Optional ✨ Extended Info 🎚 Filters
Same as \`moviesAuto\`, but omits \`start_date\` and \`days\` from the path - defaults to today and a 7-day window.`,
    method: 'GET',
    path: '/movies',
    query: extendedMediaQuerySchema
      .merge(calendarFilterParamsSchema),
    responses: {
      200: calendarMovieResponseSchema.array(),
    },
    metadata: authMetadata('optional'),
  },
  showsAuto: {
    summary: 'Get shows',
    description: `#### 🔓 OAuth Optional ✨ Extended Info 🎚 Filters
Returns shows airing during the requested UTC date range. No \`target\` segment - returns the authenticated user's calendar when a token is sent, otherwise the global calendar.`,
    method: 'GET',
    path: '/shows/:start_date/:days',
    query: extendedMediaQuerySchema
      .merge(calendarFilterParamsSchema)
      .merge(groupQuery),
    pathParams: ungatedRangeParams,
    responses: {
      200: calendarShowResponseSchema.array(),
    },
    metadata: authMetadata('optional'),
  },
  showsAutoDefault: {
    summary: 'Get shows',
    description: `#### 🔓 OAuth Optional ✨ Extended Info 🎚 Filters
Same as \`showsAuto\`, but omits \`start_date\` and \`days\` from the path - defaults to today and a 7-day window.`,
    method: 'GET',
    path: '/shows',
    query: extendedMediaQuerySchema
      .merge(calendarFilterParamsSchema)
      .merge(groupQuery),
    responses: {
      200: calendarShowResponseSchema.array(),
    },
    metadata: authMetadata('optional'),
  },
  mediaAuto: {
    summary: 'Get media',
    description: `#### 🔓 OAuth Optional ✨ Extended Info 🎚 Filters
Returns the merged feed of movies and episodes during the requested UTC date range, ordered by availability date. No \`target\` segment - returns the authenticated user's calendar when a token is sent, otherwise the global calendar. Use \`type\` to narrow to a single media type.`,
    method: 'GET',
    path: '/media/:start_date/:days',
    query: extendedMediaQuerySchema
      .merge(calendarFilterParamsSchema)
      .merge(mediaTypeQuery)
      .merge(groupQuery),
    pathParams: ungatedRangeParams,
    responses: {
      200: hotReleaseResponseSchema.array(),
    },
    metadata: authMetadata('optional'),
  },
  mediaAutoDefault: {
    summary: 'Get media',
    description: `#### 🔓 OAuth Optional ✨ Extended Info 🎚 Filters
Same as \`mediaAuto\`, but omits \`start_date\` and \`days\` from the path - defaults to today and a 7-day window.`,
    method: 'GET',
    path: '/media',
    query: extendedMediaQuerySchema
      .merge(calendarFilterParamsSchema)
      .merge(mediaTypeQuery)
      .merge(groupQuery),
    responses: {
      200: hotReleaseResponseSchema.array(),
    },
    metadata: authMetadata('optional'),
  },
  newShowsAuto: {
    summary: 'Get new shows',
    description: `#### 🔓 OAuth Optional ✨ Extended Info 🎚 Filters
Returns new shows airing their first season during the requested UTC date range. No \`target\` segment - returns the authenticated user's calendar when a token is sent, otherwise the global calendar.`,
    method: 'GET',
    path: '/shows/new/:start_date/:days',
    query: extendedMediaQuerySchema
      .merge(calendarFilterParamsSchema)
      .merge(groupQuery),
    pathParams: ungatedRangeParams,
    responses: {
      200: calendarShowResponseSchema.array(),
    },
    metadata: authMetadata('optional'),
  },
  newShowsAutoDefault: {
    summary: 'Get new shows',
    description: `#### 🔓 OAuth Optional ✨ Extended Info 🎚 Filters
Same as \`newShowsAuto\`, but omits \`start_date\` and \`days\` from the path - defaults to today and a 7-day window.`,
    method: 'GET',
    path: '/shows/new',
    query: extendedMediaQuerySchema
      .merge(calendarFilterParamsSchema)
      .merge(groupQuery),
    responses: {
      200: calendarShowResponseSchema.array(),
    },
    metadata: authMetadata('optional'),
  },
  seasonPremieresAuto: {
    summary: 'Get season premieres',
    description: `#### 🔓 OAuth Optional ✨ Extended Info 🎚 Filters
Returns season premieres airing during the requested UTC date range. No \`target\` segment - returns the authenticated user's calendar when a token is sent, otherwise the global calendar.`,
    method: 'GET',
    path: '/shows/premieres/:start_date/:days',
    query: extendedMediaQuerySchema
      .merge(calendarFilterParamsSchema)
      .merge(groupQuery),
    pathParams: ungatedRangeParams,
    responses: {
      200: calendarShowResponseSchema.array(),
    },
    metadata: authMetadata('optional'),
  },
  seasonPremieresAutoDefault: {
    summary: 'Get season premieres',
    description: `#### 🔓 OAuth Optional ✨ Extended Info 🎚 Filters
Same as \`seasonPremieresAuto\`, but omits \`start_date\` and \`days\` from the path - defaults to today and a 7-day window.`,
    method: 'GET',
    path: '/shows/premieres',
    query: extendedMediaQuerySchema
      .merge(calendarFilterParamsSchema)
      .merge(groupQuery),
    responses: {
      200: calendarShowResponseSchema.array(),
    },
    metadata: authMetadata('optional'),
  },
  releasesHot: {
    summary: 'Get hot releases',
    description: `#### ✨ Extended Info 🎚 Filters
Returns the merged feed of upcoming movies and episodes during the requested UTC date range that are trending or highly anticipated, ordered by availability date. This is the global feed only; use \`type\` to narrow to a single media type.`,
    method: 'GET',
    path: '/releases/hot/:start_date/:days',
    query: extendedMediaQuerySchema
      .merge(calendarFilterParamsSchema)
      .merge(mediaTypeQuery)
      .merge(groupQuery),
    pathParams: ungatedRangeParams,
    responses: {
      200: hotReleaseResponseSchema.array(),
    },
    metadata: authMetadata('none'),
  },
  releasesHotDefault: {
    summary: 'Get hot releases',
    description: `#### ✨ Extended Info 🎚 Filters
Same as \`releasesHot\`, but omits \`start_date\` and \`days\` from the path - defaults to today and a 7-day window.`,
    method: 'GET',
    path: '/releases/hot',
    query: extendedMediaQuerySchema
      .merge(calendarFilterParamsSchema)
      .merge(mediaTypeQuery)
      .merge(groupQuery),
    responses: {
      200: hotReleaseResponseSchema.array(),
    },
    metadata: authMetadata('none'),
  },
  releasesHotPremieres: {
    summary: 'Get hot premieres',
    description: `#### ✨ Extended Info 🎚 Filters
Returns upcoming show premieres during the requested UTC date range that are trending or highly anticipated. Curated global feed - daily-cadence formats (soap, talk, news, game shows) and specials are excluded.`,
    method: 'GET',
    path: '/releases/hot/premieres/:start_date/:days',
    query: extendedMediaQuerySchema.merge(calendarFilterParamsSchema),
    pathParams: ungatedRangeParams,
    responses: {
      200: calendarShowResponseSchema.array(),
    },
    metadata: authMetadata('none'),
  },
  releasesHotPremieresDefault: {
    summary: 'Get hot premieres',
    description: `#### ✨ Extended Info 🎚 Filters
Same as \`releasesHotPremieres\`, but omits \`start_date\` and \`days\` from the path - defaults to today and a 7-day window.`,
    method: 'GET',
    path: '/releases/hot/premieres',
    query: extendedMediaQuerySchema.merge(calendarFilterParamsSchema),
    responses: {
      200: calendarShowResponseSchema.array(),
    },
    metadata: authMetadata('none'),
  },
  releasesHotFinales: {
    summary: 'Get hot finales',
    description: `#### ✨ Extended Info 🎚 Filters
Returns upcoming show finales during the requested UTC date range that are trending or highly anticipated. Curated global feed - daily-cadence formats (soap, talk, news, game shows) and specials are excluded.`,
    method: 'GET',
    path: '/releases/hot/finales/:start_date/:days',
    query: extendedMediaQuerySchema.merge(calendarFilterParamsSchema),
    pathParams: ungatedRangeParams,
    responses: {
      200: calendarShowResponseSchema.array(),
    },
    metadata: authMetadata('none'),
  },
  releasesHotFinalesDefault: {
    summary: 'Get hot finales',
    description: `#### ✨ Extended Info 🎚 Filters
Same as \`releasesHotFinales\`, but omits \`start_date\` and \`days\` from the path - defaults to today and a 7-day window.`,
    method: 'GET',
    path: '/releases/hot/finales',
    query: extendedMediaQuerySchema.merge(calendarFilterParamsSchema),
    responses: {
      200: calendarShowResponseSchema.array(),
    },
    metadata: authMetadata('none'),
  },
  releasesHotNew: {
    summary: 'Get hot new shows',
    description: `#### ✨ Extended Info 🎚 Filters
Returns upcoming series premieres during the requested UTC date range that are trending or highly anticipated. Curated global feed - daily-cadence formats (soap, talk, news, game shows) and specials are excluded.`,
    method: 'GET',
    path: '/releases/hot/new/:start_date/:days',
    query: extendedMediaQuerySchema.merge(calendarFilterParamsSchema),
    pathParams: ungatedRangeParams,
    responses: {
      200: calendarShowResponseSchema.array(),
    },
    metadata: authMetadata('none'),
  },
  releasesHotNewDefault: {
    summary: 'Get hot new shows',
    description: `#### ✨ Extended Info 🎚 Filters
Same as \`releasesHotNew\`, but omits \`start_date\` and \`days\` from the path - defaults to today and a 7-day window.`,
    method: 'GET',
    path: '/releases/hot/new',
    query: extendedMediaQuerySchema.merge(calendarFilterParamsSchema),
    responses: {
      200: calendarShowResponseSchema.array(),
    },
    metadata: authMetadata('none'),
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
