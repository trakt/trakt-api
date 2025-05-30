import { z } from '../z.ts';

export const translationResponseSchema = z.array(
  z.object({
    title: z.string().nullish(),
    overview: z.string().nullish(),
    tagline: z.string().nullish(),
    language: z.string(),
    country: z.string(),
  }),
);
