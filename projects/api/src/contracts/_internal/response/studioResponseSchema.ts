import { z } from '../z.ts';

/** Zod schema for the studio response. */
export const studioResponseSchema = z.object({
  name: z.string(),
  country: z.string().nullish(),
  ids: z.object({
    slug: z.string(),
    trakt: z.number().int(),
    tmdb: z.number().int().nullish(),
  }),
});
