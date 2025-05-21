import { z } from '../z.ts';

export const episodeIdsResponseSchema = z.object({
  trakt: z.number().int(),
  tvdb: z.number().int(),
  imdb: z.string().nullable(),
  tmdb: z.number().int(),
});
