import { builder } from '../_internal/builder.ts';
import { z } from '../_internal/z.ts';

const countryTypeParamsSchema = z.object({
  type: z.string().describe('Media type to return countries for.'),
});

export const countryResponseSchema = z.object({
  name: z.string(),
  code: z.string(),
});

export const countries = builder.router({
  list: {
    summary: 'Get countries',
    description: 'Get a list of all countries, including names and codes.',
    path: '/:type',
    method: 'GET',
    pathParams: countryTypeParamsSchema,
    responses: {
      200: countryResponseSchema.array(),
    },
  },
}, {
  pathPrefix: '/countries',
});

export type CountryResponse = z.infer<typeof countryResponseSchema>;
