import type { z } from 'zod';
import type { productionReviewSchema } from './productionReviewSchema.ts';

export type ProductionReview = z.infer<typeof productionReviewSchema>;
