import { builder } from '../_internal/builder.ts';
import type { z } from '../_internal/z.ts';
import {
  movieCertificationsResponseSchema,
} from './schema/movieCertificationsResponseSchema.ts';
import { showCertificationsResponseSchema } from './schema/showCertificationsResponseSchema.ts';

export const certifications = builder.router({
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

export type MovieCertificationsResponse = z.infer<
  typeof movieCertificationsResponseSchema
>;
export type ShowCertificationsResponse = z.infer<
  typeof showCertificationsResponseSchema
>;
