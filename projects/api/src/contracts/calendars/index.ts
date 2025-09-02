import { builder } from '../_internal/builder.ts';
import { extendedMediaQuerySchema } from '../_internal/request/extendedMediaQuerySchema.ts';
import type { z } from '../_internal/z.ts';
import { calendarRequestParamsSchema } from './schema/request/calendarParamsSchema.ts';
import { calendarMovieResponseSchema } from './schema/response/calendarMovieResponseSchema.ts';
import { calendarShowResponseSchema } from './schema/response/calendarShowListResponseSchema.ts';

export const calendars = builder.router({
  shows: {
    method: 'GET',
    path: '/:target/shows/:start_date/:days',
    query: extendedMediaQuerySchema,
    pathParams: calendarRequestParamsSchema,
    responses: {
      200: calendarShowResponseSchema.array(),
    },
  },
  newShows: {
    method: 'GET',
    path: '/:target/shows/new/:start_date/:days',
    query: extendedMediaQuerySchema,
    pathParams: calendarRequestParamsSchema,
    responses: {
      200: calendarShowResponseSchema.array(),
    },
  },
  seasonPremieres: {
    method: 'GET',
    path: '/:target/shows/premieres/:start_date/:days',
    query: extendedMediaQuerySchema,
    pathParams: calendarRequestParamsSchema,
    responses: {
      200: calendarShowResponseSchema.array(),
    },
  },
  finales: {
    method: 'GET',
    path: '/:target/shows/finales/:start_date/:days',
    query: extendedMediaQuerySchema,
    pathParams: calendarRequestParamsSchema,
    responses: {
      200: calendarShowResponseSchema.array(),
    },
  },
  movies: {
    method: 'GET',
    path: '/:target/movies/:start_date/:days',
    query: extendedMediaQuerySchema,
    pathParams: calendarRequestParamsSchema,
    responses: {
      200: calendarMovieResponseSchema.array(),
    },
  },
  dvdReleases: {
    method: 'GET',
    path: '/:target/dvd/:start_date/:days',
    query: extendedMediaQuerySchema,
    pathParams: calendarRequestParamsSchema,
    responses: {
      200: calendarMovieResponseSchema.array(),
    },
  },
}, { pathPrefix: '/calendars' });

export type CalendarParams = z.infer<typeof calendarRequestParamsSchema>;
export type CalendarShowResponse = z.infer<
  typeof calendarShowResponseSchema
>;
export type CalendarMovieResponse = z.infer<typeof calendarMovieResponseSchema>;
