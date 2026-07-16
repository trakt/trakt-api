import { builder } from '../_internal/builder.ts';
import { z } from '../_internal/z.ts';
import {
  movieCertificationsResponseSchema,
} from './schema/movieCertificationsResponseSchema.ts';
import { showCertificationsResponseSchema } from './schema/showCertificationsResponseSchema.ts';

const certificationTypeParamsSchema = z.object({
  type: z.string().describe(
    'Certification media type, typically `movies` or `shows`.',
  ),
});

/** ts-rest contract for the `certifications` endpoints. */
export const certifications = builder.router({
  list: {
    summary: 'Get certifications',
    description:
      'Get a list of all certifications, including names, slugs, and descriptions.',
    method: 'GET',
    path: '/:type',
    pathParams: certificationTypeParamsSchema,
    responses: {
      200: z.union([
        movieCertificationsResponseSchema,
        showCertificationsResponseSchema,
      ]),
    },
  },
  shows: {
    summary: 'Get show certifications',
    description:
      'Returns show certifications grouped by country, including certification name, slug, and description.',
    method: 'GET',
    path: '/shows',
    responses: {
      200: showCertificationsResponseSchema,
    },
  },
  movies: {
    summary: 'Get movie certifications',
    description:
      'Returns movie certifications grouped by country, including certification name, slug, and description.',
    method: 'GET',
    path: '/movies',
    responses: {
      200: movieCertificationsResponseSchema,
    },
  },
}, {
  pathPrefix: '/certifications',
});

export { movieCertificationsResponseSchema, showCertificationsResponseSchema };

/** The movie certifications response payload. */
export type MovieCertificationsResponse = z.infer<
  typeof movieCertificationsResponseSchema
>;
/** The show certifications response payload. */
export type ShowCertificationsResponse = z.infer<
  typeof showCertificationsResponseSchema
>;
