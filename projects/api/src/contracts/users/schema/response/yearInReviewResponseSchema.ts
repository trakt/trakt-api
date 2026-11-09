import { z } from '../../../_internal/z.ts';
import {
  reviewAllStatsSchema,
  reviewBaseResponseSchema,
  reviewTypeStatsSchema,
} from './reviewBaseResponseSchema.ts';

/** Zod schema for the share images of a year or all-time review. */
export const yearReviewImagesSchema = z.object({
  cover: z.string(),
  story: z.string().nullable().openapi({
    description: 'Always null: only a month has a story image.',
  }),
});

/** Zod schema for the year in review response, for one year or a range. */
export const yearInReviewResponseSchema = reviewBaseResponseSchema.extend({
  stats: z.object({
    all: reviewAllStatsSchema,
    shows: reviewTypeStatsSchema,
    movies: reviewTypeStatsSchema,
  }),
  images: yearReviewImagesSchema,
});
