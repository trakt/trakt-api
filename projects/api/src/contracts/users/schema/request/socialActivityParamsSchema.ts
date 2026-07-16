import { z } from '../../../_internal/z.ts';

/** Zod schema for the social activity parameters. */
export const socialActivityParamsSchema = z.object({
  type: z.enum(['friends', 'followers', 'following']),
});
