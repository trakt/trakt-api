import { profileResponseSchema } from '../../../_internal/response/profileResponseSchema.ts';
import { z } from '../../../_internal/z.ts';

export const requestsResponseSchema = z.object({
  id: z.number().int(),
  requested_at: z.string().datetime(),
  user: profileResponseSchema,
});
