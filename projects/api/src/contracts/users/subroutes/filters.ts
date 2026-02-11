import { builder } from '../../_internal/builder.ts';
import { pageQuerySchema } from '../../_internal/request/pageQuerySchema.ts';
import { z } from '../../_internal/z.ts';
import { addFilterRequestSchema } from '../schema/request/addFilterRequestSchema.ts';
import { filterIdParamsSchema } from '../schema/request/filterIdParamsSchema.ts';
import { sectionParamsSchema } from '../schema/request/sectionParamsSchema.ts';
import { addFilterResponseSchema } from '../schema/response/addFilterResponseSchema.ts';
import { filterResponseSchema } from '../schema/response/filterResponseSchema.ts';

export const filters = builder.router({
  saved: {
    path: '/:section',
    method: 'GET',
    pathParams: sectionParamsSchema,
    query: pageQuerySchema,
    responses: {
      200: filterResponseSchema.array(),
    },
  },
  add: {
    path: '',
    method: 'POST',
    body: addFilterRequestSchema.array(),
    responses: {
      201: addFilterResponseSchema,
    },
  },
  delete: {
    path: '/:id',
    method: 'DELETE',
    pathParams: filterIdParamsSchema,
    responses: {
      204: z.undefined(),
      404: z.undefined(),
    },
  },
}, {
  pathPrefix: '/saved_filters',
});

export type FilterSection = z.infer<typeof sectionParamsSchema>;
export type FilterResponse = z.infer<typeof filterResponseSchema>;
