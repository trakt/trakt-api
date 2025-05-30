import { progressResponseSchema } from '../../../_internal/response/progressResponseSchema.ts';
import { seasonIdsResponseSchema } from '../../../_internal/response/seasonIdsResponseSchema.ts';
import { statsResponseSchema } from '../../../_internal/response/statsResponseSchema.ts';
import { z } from '../../../_internal/z.ts';

export const showProgressResponseSchema = progressResponseSchema.extend({
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
          last_watched_at: z.string().datetime().nullish(),
          /***
           * Available if requesting include_stats `true`.
           */
          stats: statsResponseSchema.nullish(),
        }),
      ),
      /***
       * Available if requesting include_stats `true`.
       */
      stats: statsResponseSchema.nullish(),
    }),
  ),
  hidden_seasons: z.array(
    z.object({
      number: z.number().int(),
      ids: seasonIdsResponseSchema,
    }),
  ),
  /***
   * Available if requesting include_stats `true`.
   */
  stats: statsResponseSchema.nullish(),
});
