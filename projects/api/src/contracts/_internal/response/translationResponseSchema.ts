import { z } from '../z.ts';

/** Zod schema for the translation response. */
export const translationResponseSchema = z.array(
  z.object({
    title: z.string().nullish(),
    overview: z.string().nullish(),
    tagline: z.string().nullish(),
    language: z.string(),
    country: z.string().nullish(),
  }),
);
