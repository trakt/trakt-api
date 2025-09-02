import { z } from '../../../_internal/z.ts';

export const tokenResponseSchema = z.object({
  access_token: z.string(),
  token_type: z.string(),
  expires_in: z.number().int(),
  refresh_token: z.string(),
  scope: z.string(),
  created_at: z.number().int(),
});
