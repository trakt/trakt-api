import { profileResponseSchema } from '../../../_internal/response/profileResponseSchema.ts';
import { z } from '../../../_internal/z.ts';

/** Zod schema for the requests response. */
export const requestsResponseSchema = z.object({
  id: z.number().int(),
  requested_at: z.string().datetime(),
  user: profileResponseSchema,
});
