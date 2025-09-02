import { z } from '../../../_internal/z.ts';

export const checkin409ErrorResponse = z.object({
  expires_at: z.string({
    description: 'Timestamp which is when the user can check in again.',
  }),
});
