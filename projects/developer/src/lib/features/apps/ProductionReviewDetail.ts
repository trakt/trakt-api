import type { z } from 'zod';
import type { productionReviewDetailSchema } from './productionReviewDetailSchema.ts';

export type ProductionReviewDetail = z.infer<
  typeof productionReviewDetailSchema
>;
