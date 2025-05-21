import { z } from 'zod';

export const videoResponseSchema = z.object({
  title: z.string(),
  url: z.string(),
  site: z.string(),
  type: z.enum([
    'trailer',
    'clip',
    'teaser',
    'featurette',
    'recap',
    'behind the scenes',
    'opening credits',
  ]),
  size: z.number().int(),
  official: z.boolean(),
  published_at: z.string().datetime(),
  country: z.string(),
  language: z.string(),
});
