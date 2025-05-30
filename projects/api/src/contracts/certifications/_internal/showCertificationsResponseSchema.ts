import { z } from '../../_internal/z.ts';

const showCertificationSlugResponseSchema = z.enum([
  'tv-y',
  'tv-y7',
  'tv-g',
  'tv-pg',
  'tv-14',
  'tv-ma',
  'nr',
]).forceString();

const certificationResponseSchema = z.object({
  name: z.string(),
  slug: showCertificationSlugResponseSchema,
  description: z.string(),
});

export const showCertificationsResponseSchema = z.object({
  us: certificationResponseSchema.array(),
});
