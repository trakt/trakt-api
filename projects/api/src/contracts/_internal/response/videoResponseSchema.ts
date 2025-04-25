import { z } from 'zod';

export const videoResponseSchema = z.object({
  title: z.string(),
  url: z.string(),
  site: z.string(),
  type: z.enum(['recap', 'featurette', 'teaser']),
  size: z.number(),
  official: z.boolean(),
  published_at: z.string(),
  country: z.string(),
  language: z.string(),
});
