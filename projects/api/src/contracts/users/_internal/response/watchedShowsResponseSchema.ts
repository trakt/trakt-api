import { showIdsResponseSchema } from '../../../_internal/response/showIdsResponseSchema.ts';
import { z } from '../../../_internal/z.ts';

export const watchedShowsResponseSchema = z.array(z.object({
  plays: z.number().int(),
  last_watched_at: z.string().datetime(),
  last_updated_at: z.string().datetime(),
  reset_at: z.string().datetime().nullish(),
  show: z.object({
    aired_episodes: z.number().int(),
    title: z.string(),
    year: z.number().int(),
    ids: showIdsResponseSchema,
  }),
  /***
   * Omitted if requesting extended `noseasons`.
   */
  seasons: z.array(
    z.object({
      number: z.number().int(),
      episodes: z.array(
        z.object({
          number: z.number().int(),
          plays: z.number().int(),
          last_watched_at: z.string().datetime(),
        }),
      ),
    }),
  ).optional(),
}));
