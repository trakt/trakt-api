import { builder } from '../_internal/builder.ts';
import { z } from '../_internal/z.ts';

const countryTypeParamsSchema = z.object({
  type: z.enum(['movies', 'shows']).describe(
    'Media type to return countries for.',
  ),
});

/** Zod schema for the country response. */
export const countryResponseSchema = z.object({
  name: z.string(),
  code: z.string(),
});

/** ts-rest contract for the `countries` endpoints. */
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

/** The country response payload. */
export type CountryResponse = z.infer<typeof countryResponseSchema>;
