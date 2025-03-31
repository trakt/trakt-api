import { distributionResponseSchema } from '../../../_internal/response/distributionResponseSchema.ts';
import { z } from '../../../_internal/z.ts';

const simpleStatsResponseSchema = z.object({
  ratings: z.number(),
  comments: z.number(),
});

const extendedStatsResponseSchema = simpleStatsResponseSchema.extend({
  watched: z.number(),
  collected: z.number(),
});

const fullStatsResponseSchema = extendedStatsResponseSchema.extend({
  plays: z.number(),
  minutes: z.number(),
});

export const userStatsResponseSchema = z.object({
  seasons: simpleStatsResponseSchema,
  shows: extendedStatsResponseSchema,
  movies: fullStatsResponseSchema,
  episodes: fullStatsResponseSchema,
  network: z.object({
    friends: z.number(),
    followers: z.number(),
    following: z.number(),
  }),
  ratings: z.object({
    total: z.number(),
    distribution: distributionResponseSchema,
  }),
});
