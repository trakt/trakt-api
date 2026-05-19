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
    summary: 'Get saved filters',
    description: `#### 🔥 VIP Only 🔒 OAuth Required 📄 Pagination
Get all saved filters a user has created. The \`path\` and \`query\` can be used to construct an API path to retrieve the saved data. Think of this like a dynamically updated list.`,
    path: '/:section',
    method: 'GET',
    pathParams: sectionParamsSchema,
    query: pageQuerySchema,
    responses: {
      200: filterResponseSchema.array(),
    },
  },
  add: {
    summary: 'Add saved filters',
    description: `#### 🔥 VIP Only 🔒 OAuth Required
Create saved filters for the authenticated user. Send filter names and URLs in the request body; the response returns the created filter records.`,
    path: '',
    method: 'POST',
    body: addFilterRequestSchema.array(),
    responses: {
      201: addFilterResponseSchema,
    },
  },
  delete: {
    summary: 'Delete saved filter',
    description: `#### 🔥 VIP Only 🔒 OAuth Required
Delete a saved filter by \`id\`. A successful delete returns \`204\`; an unknown filter returns \`404\`.`,
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
