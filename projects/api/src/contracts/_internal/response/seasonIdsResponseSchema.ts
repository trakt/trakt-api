import { z } from '../z.ts';

export const seasonIdsResponseSchema = z.object({
  trakt: z.number().int(),
  tvdb: z.number().int().nullish(),
  tmdb: z.number().int().nullish(),
});
