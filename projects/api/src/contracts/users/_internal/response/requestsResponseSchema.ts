import { profileResponseSchema } from '../../../_internal/response/userProfileResponseSchema.ts';
import { z } from '../../../_internal/z.ts';

export const requestsResponseSchema = z.object({
  id: z.number(),
  requested_at: z.string(),
  user: profileResponseSchema,
});
