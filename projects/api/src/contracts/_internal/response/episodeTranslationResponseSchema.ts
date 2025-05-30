import { z } from '../z.ts';

export const episodeTranslationResponseSchema = z.array(
  z.object({
    title: z.string().nullish(),
    overview: z.string().nullish(),
    language: z.string(),
    country: z.string(),
  }),
);
