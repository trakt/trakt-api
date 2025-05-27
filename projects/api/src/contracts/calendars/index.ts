import { builder } from '../_internal/builder.ts';
import { extendedMediaQuerySchema } from '../_internal/request/extendedMediaQuerySchema.ts';
import { movieResponseSchema } from '../_internal/response/movieResponseSchema.ts';
import type { z } from '../_internal/z.ts';
import { calendarRequestParamsSchema } from './_internal/request/calendarParamsSchema.ts';
import { calendarShowListResponseSchema } from './_internal/response/calendarShowListResponseSchema.ts';

export const calendars = builder.router({
  shows: {
    method: 'GET',
    path: '/:target/shows/:start_date/:days',
    query: extendedMediaQuerySchema,
    pathParams: calendarRequestParamsSchema,
    responses: {
      200: calendarShowListResponseSchema,
    },
  },
  newShows: {
    method: 'GET',
    path: '/:target/shows/new/:start_date/:days',
    query: extendedMediaQuerySchema,
    pathParams: calendarRequestParamsSchema,
    responses: {
      200: calendarShowListResponseSchema,
    },
  },
  seasonPremieres: {
    method: 'GET',
    path: '/:target/shows/premieres/:start_date/:days',
    query: extendedMediaQuerySchema,
    pathParams: calendarRequestParamsSchema,
    responses: {
      200: calendarShowListResponseSchema,
    },
  },
  finales: {
    method: 'GET',
    path: '/:target/shows/finales/:start_date/:days',
    query: extendedMediaQuerySchema,
    pathParams: calendarRequestParamsSchema,
    responses: {
      200: calendarShowListResponseSchema,
    },
  },
  movies: {
    method: 'GET',
    path: '/:target/movies/:start_date/:days',
    query: extendedMediaQuerySchema,
    pathParams: calendarRequestParamsSchema,
    responses: {
      200: movieResponseSchema.array(),
    },
  },
  dvdReleases: {
    method: 'GET',
    path: '/:target/dvd/:start_date/:days',
    query: extendedMediaQuerySchema,
    pathParams: calendarRequestParamsSchema,
    responses: {
      200: movieResponseSchema.array(),
    },
  },
}, { pathPrefix: '/calendars' });

export type CalendarParams = z.infer<typeof calendarRequestParamsSchema>;
export type CalendarShowListResponse = z.infer<
  typeof calendarShowListResponseSchema
>;
export type CalendarMovieListResponse = z.infer<typeof movieResponseSchema>[];
