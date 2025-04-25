import { showResponseSchema } from '../../../_internal/response/showResponseSchema.ts';
import { z } from '../../../_internal/z.ts';

export const showTrendingResponseSchema = z.object({
  watchers: z.number(),
  show: showResponseSchema,
});
