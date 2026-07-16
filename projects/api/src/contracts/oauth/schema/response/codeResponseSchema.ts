import { z } from '../../../_internal/z.ts';

/** Zod schema for the code response. */
export const codeResponseSchema = z.object({
  device_code: z.string(),
  user_code: z.string(),
  verification_url: z.string(),
  expires_in: z.number().int(),
  interval: z.number().int(),
});
