import { z } from 'zod';
import { applicationProfileSchema } from './applicationProfileSchema.ts';
import { productionReviewSchema } from './productionReviewSchema.ts';

export const productionReviewDetailSchema = productionReviewSchema.extend({
  profile: applicationProfileSchema.omit({
    updated_at: true,
    updated_by: true,
  }),
  redirect_uri: z.array(z.string()),
  client_secret_reason: z.string().nullable(),
});
