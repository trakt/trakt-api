import { builder } from '../../_internal/builder.ts';
import { pageQuerySchema } from '../../_internal/request/pageQuerySchema.ts';
import type { z } from '../../_internal/z.ts';
import { sectionParamsSchema } from '../_internal/request/sectionParamsSchema.ts';
import { filterResponseSchema } from '../_internal/response/filterResponseSchema.ts';

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
}, {
  pathPrefix: '/saved_filters',
});

export type FilterSection = z.infer<typeof sectionParamsSchema>;
export type FilterResponse = z.infer<typeof filterResponseSchema>;
