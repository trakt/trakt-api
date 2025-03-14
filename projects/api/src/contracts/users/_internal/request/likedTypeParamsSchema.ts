import { z } from '../../../_internal/z.ts';

export const likedTypeParamsSchema = z.object({
  type: z.enum(['comments', 'lists']),
});
