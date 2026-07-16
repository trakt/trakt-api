import { reviewBaseSchema } from './monthInReviewResponseSchema.ts';

// Year in Review returns the same shape as Month in Review minus
// `streaming_services` (that catalog scan is bounded to a single month).
/** Zod schema for the year in review response. */
export const yearInReviewResponseSchema = reviewBaseSchema;
