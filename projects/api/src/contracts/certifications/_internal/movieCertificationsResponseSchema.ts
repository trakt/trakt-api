import { z } from '../../_internal/z.ts';

const movieCertificationSlugResponseSchema = z.enum([
  'g',
  'pg',
  'pg-13',
  'r',
  'nr',
]).forceString();

const certificationResponseSchema = z.object({
  name: z.string(),
  slug: movieCertificationSlugResponseSchema,
  description: z.string(),
});

export const movieCertificationsResponseSchema = z.object({
  us: certificationResponseSchema.array(),
});
