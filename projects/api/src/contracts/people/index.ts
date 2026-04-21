import { builder } from '../_internal/builder.ts';
import { extendedMediaQuerySchema } from '../_internal/request/extendedMediaQuerySchema.ts';
import { extendedPeopleQuerySchema } from '../_internal/request/extendedPeopleQuerySchema.ts';
import { idParamsSchema } from '../_internal/request/idParamsSchema.ts';
import { z } from '../_internal/z.ts';
import { peopleReportRequestSchema } from './schema/request/peopleReportRequestSchema.ts';
import { peopleMovieCreditsResponseSchema } from './schema/response/peopleMovieCreditsResponseSchema.ts';
import { peopleShowCreditsResponseSchema } from './schema/response/peopleShowCreditsResponseSchema.ts';
import { personResponseSchema } from './schema/response/personResponseSchema.ts';

export const people = builder.router({
  summary: {
    path: '/',
    pathParams: idParamsSchema,
    query: extendedPeopleQuerySchema,
    method: 'GET',
    responses: {
      200: personResponseSchema,
    },
  },
  movies: {
    path: '/movies',
    pathParams: idParamsSchema,
    query: extendedMediaQuerySchema,
    method: 'GET',
    responses: {
      200: peopleMovieCreditsResponseSchema,
    },
  },
  shows: {
    path: '/shows',
    pathParams: idParamsSchema,
    query: extendedMediaQuerySchema,
    method: 'GET',
    responses: {
      200: peopleShowCreditsResponseSchema,
    },
  },
  report: {
    path: '/report',
    method: 'POST',
    pathParams: idParamsSchema,
    body: peopleReportRequestSchema,
    responses: {
      201: z.undefined(),
      400: z.undefined(),
      409: z.undefined(),
    },
  },
}, {
  pathPrefix: '/people/:id',
});

export { personResponseSchema };
export type PersonResponse = z.infer<
  typeof personResponseSchema
>;

export { peopleMovieCreditsResponseSchema };

export { peopleShowCreditsResponseSchema };

export { peopleReportRequestSchema };
export type PeopleReportRequest = z.infer<typeof peopleReportRequestSchema>;
export type PeopleMovieCreditsResponse = z.infer<
  typeof peopleMovieCreditsResponseSchema
>;
export type PeopleShowCreditsResponse = z.infer<
  typeof peopleShowCreditsResponseSchema
>;
