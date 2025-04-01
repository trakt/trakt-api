import { builder } from '../../_internal/builder.ts';
import { bulkMediaRequestSchema } from '../../_internal/request/bulkMediaRequestSchema.ts';
import { extendedQuerySchemaFactory } from '../../_internal/request/extendedQuerySchemaFactory.ts';
import { pageQuerySchema } from '../../_internal/request/pageQuerySchema.ts';
import type { z } from '../../_internal/z.ts';
import { hiddenParamsSchema } from '../_internal/request/hiddenParamsSchema.ts';
import { hiddenShowRequestSchema } from '../_internal/request/hiddenShowRequestSchema.ts';
import { hiddenAddResponseSchema } from '../_internal/response/hiddenAddResponseSchema.ts';
import { hiddenRemoveResponseSchema } from '../_internal/response/hiddenRemoveResponseSchema.ts';
import { hiddenShowResponseSchema } from '../_internal/response/hiddenShowResponseSchema.ts';

export const hidden = builder.router({
  add: {
    path: '/:section',
    pathParams: hiddenParamsSchema,
    method: 'POST',
    body: bulkMediaRequestSchema,
    responses: {
      200: hiddenAddResponseSchema,
    },
  },
  get: {
    path: '/progress_watched',
    method: 'GET',
    query: extendedQuerySchemaFactory<['full', 'images']>()
      .merge(pageQuerySchema)
      .merge(hiddenShowRequestSchema),
    responses: {
      200: hiddenShowResponseSchema.array(),
    },
  },
  remove: {
    progress: {
      path: '/progress_watched/remove',
      method: 'POST',
      body: bulkMediaRequestSchema,
      responses: {
        200: hiddenRemoveResponseSchema,
      },
    },
    calendar: {
      path: '/calendar/remove',
      method: 'POST',
      body: bulkMediaRequestSchema,
      responses: {
        200: hiddenRemoveResponseSchema,
      },
    },
  },
}, {
  pathPrefix: '/hidden',
});

export type HiddenShowItemResponse = z.infer<
  typeof hiddenShowResponseSchema
>;
export type HiddenMediaRequest = z.infer<typeof bulkMediaRequestSchema>;
