import { builder } from '../_internal/builder.ts';
import type { z } from '../_internal/z.ts';
import {
  movieCertificationsResponseSchema,
} from './schema/movieCertificationsResponseSchema.ts';
import { showCertificationsResponseSchema } from './schema/showCertificationsResponseSchema.ts';

export const certifications = builder.router({
  shows: {
    method: 'GET',
    path: '/shows',
    responses: {
      200: showCertificationsResponseSchema,
    },
  },
  movies: {
    method: 'GET',
    path: '/movies',
    responses: {
      200: movieCertificationsResponseSchema,
    },
  },
}, {
  pathPrefix: '/certifications',
});

export type MovieCertificationsResponse = z.infer<
  typeof movieCertificationsResponseSchema
>;
export type ShowCertificationsResponse = z.infer<
  typeof showCertificationsResponseSchema
>;
