import { z } from 'zod';
import { productionSignInSchema } from './productionSignInSchema.ts';

export const applicationProfileSchema = z.object({
  summary: z.string(),
  open_source: z.boolean(),
  product_links: z.array(z.string()),
  privacy_url: z.string(),
  notice_links: z.array(z.string()),
  expected_mau: z.number(),
  sign_in: productionSignInSchema,
  writes_user_data: z.boolean(),
  other_data_sources: z.string().nullable(),
  other_sync_services: z.string().nullable(),
  updated_at: z.string(),
  updated_by: z.object({ username: z.string() }),
});
