import { reviewBaseSchema } from './monthInReviewResponseSchema.ts';

// Year in Review returns the same shape as Month in Review minus
// `streaming_services` (that catalog scan is bounded to a single month).
export const yearInReviewResponseSchema = reviewBaseSchema;
