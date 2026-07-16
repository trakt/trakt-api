import { z } from '../../../_internal/z.ts';

/** Zod schema for the token response. */
export const tokenResponseSchema = z.object({
  access_token: z.string(),
  token_type: z.string(),
  expires_in: z.number().int(),
  refresh_token: z.string(),
  scope: z.string(),
  created_at: z.number().int(),
});
