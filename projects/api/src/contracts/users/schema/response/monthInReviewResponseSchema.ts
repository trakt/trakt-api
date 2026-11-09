import { z } from '../../../_internal/z.ts';
import {
  reviewAllStatsSchema,
  reviewBaseResponseSchema,
  reviewDistributionsSchema,
  reviewTypeStatsSchema,
} from './reviewBaseResponseSchema.ts';

// daily: plays per day of the month.
const monthTypeStatsSchema = reviewTypeStatsSchema.extend({
  distributions: reviewDistributionsSchema.extend({
    daily: z.number().int().array(),
  }),
});

/**
 * Zod schema for the month in review streaming services.
 * streaming_services: subscription services the user watched on, with per-type counts.
 */
export const reviewStreamingServicesSchema = z.object({
  country: z.string(),
  services: z
    .object({
      source: z.string(),
      name: z.string(),
      shows: z.number().int(),
      movies: z.number().int(),
      all: z.number().int(),
    })
    .array(),
});

/** Zod schema for the month in review response. */
export const monthInReviewResponseSchema = reviewBaseResponseSchema.extend({
  stats: z.object({
    all: reviewAllStatsSchema,
    shows: monthTypeStatsSchema,
    movies: monthTypeStatsSchema,
  }),
  images: z.object({
    cover: z.string(),
    story: z.string(),
  }),
  streaming_services: reviewStreamingServicesSchema,
});
