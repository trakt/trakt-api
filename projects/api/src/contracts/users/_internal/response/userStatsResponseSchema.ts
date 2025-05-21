import { distributionResponseSchema } from '../../../_internal/response/distributionResponseSchema.ts';
import { z } from '../../../_internal/z.ts';

const simpleStatsResponseSchema = z.object({
  ratings: z.number().int(),
  comments: z.number().int(),
});

const extendedStatsResponseSchema = simpleStatsResponseSchema.extend({
  watched: z.number().int(),
  collected: z.number().int(),
});

const fullStatsResponseSchema = extendedStatsResponseSchema.extend({
  plays: z.number().int(),
  minutes: z.number().int(),
});

export const userStatsResponseSchema = z.object({
  seasons: simpleStatsResponseSchema,
  shows: extendedStatsResponseSchema,
  movies: fullStatsResponseSchema,
  episodes: fullStatsResponseSchema,
  network: z.object({
    friends: z.number().int(),
    followers: z.number().int(),
    following: z.number().int(),
  }),
  ratings: z.object({
    total: z.number().int(),
    distribution: distributionResponseSchema,
  }),
});
