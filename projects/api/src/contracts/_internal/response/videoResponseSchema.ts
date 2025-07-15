import { z } from '../z.ts';
import { videoTypeEnumSchema } from './videoTypeEnumSchema.ts';

export const videoResponseSchema = z.object({
  title: z.string(),
  url: z.string(),
  site: z.string(),
  type: videoTypeEnumSchema,
  size: z.number().int(),
  official: z.boolean(),
  published_at: z.string().datetime(),
  country: z.string(),
  language: z.string(),
});
