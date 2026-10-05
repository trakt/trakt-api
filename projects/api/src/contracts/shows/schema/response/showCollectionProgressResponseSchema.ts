import { episodeResponseSchema } from '../../../_internal/response/episodeResponseSchema.ts';
import { seasonIdsResponseSchema } from '../../../_internal/response/seasonIdsResponseSchema.ts';
import { z } from '../../../_internal/z.ts';

/** Zod schema for the show collection progress response. */
export const showCollectionProgressResponseSchema = z.object({
  aired: z.number().int(),
  completed: z.number().int(),
  last_collected_at: z.string().datetime().nullish(),
  seasons: z.array(
    z.object({
      number: z.number().int(),
      title: z.string().nullish(),
      aired: z.number().int(),
      completed: z.number().int(),
      episodes: z.array(
        z.object({
          number: z.number().int(),
          completed: z.boolean(),
          collected_at: z.string().datetime().nullish(),
        }),
      ),
    }),
  ),
  hidden_seasons: z.array(
    z.object({
      number: z.number().int(),
      ids: seasonIdsResponseSchema,
    }),
  ),
  next_episode: episodeResponseSchema.or(z.null()),
  last_episode: episodeResponseSchema.or(z.null()),
});
