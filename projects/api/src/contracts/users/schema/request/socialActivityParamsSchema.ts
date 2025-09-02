import { z } from '../../../_internal/z.ts';

export const socialActivityParamsSchema = z.object({
  type: z.enum(['friends', 'followers', 'following']),
});
