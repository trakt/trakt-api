import { builder } from '../../_internal/builder.ts';
import { pageQuerySchema } from '../../_internal/request/pageQuerySchema.ts';
import type { z } from '../../_internal/z.ts';
import { sectionParamsSchema } from '../schema/request/sectionParamsSchema.ts';
import { filterResponseSchema } from '../schema/response/filterResponseSchema.ts';

/** ts-rest contract for the `filters` endpoints. */
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
}, {
  pathPrefix: '/saved_filters',
});

/** The filter section type. */
export type FilterSection = z.infer<typeof sectionParamsSchema>;
/** The filter response payload. */
export type FilterResponse = z.infer<typeof filterResponseSchema>;
