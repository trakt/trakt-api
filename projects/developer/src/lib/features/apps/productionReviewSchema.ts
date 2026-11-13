import { z } from 'zod';
import { productionStatusSchema } from './productionStatusSchema.ts';

export const productionReviewSchema = z.object({
  id: z.number(),
  kind: z.enum(['production', 'update', 'client_secret', 'post_review']),
  status: productionStatusSchema,
  submitted_at: z.string(),
  reviewed_at: z.string().nullish(),
  review_note: z.string().nullish(),
  client_secret_requested: z.boolean(),
  granted_access: z.enum(['read_only', 'full']).nullish(),
});
