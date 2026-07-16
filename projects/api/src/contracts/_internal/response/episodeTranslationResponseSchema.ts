import { z } from '../z.ts';

/** Zod schema for the episode translation response. */
export const episodeTranslationResponseSchema = z.array(
  z.object({
    title: z.string().nullish(),
    overview: z.string().nullish(),
    language: z.string(),
    country: z.string(),
  }),
);
