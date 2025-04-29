import { ignoreQuerySchema } from '../../../_internal/request/ignoreQuerySchema.ts';
import { z } from '../../../_internal/z.ts';

export const recommendationsQuerySchema = z.object({
  limit: z.number().optional(),
  watch_window: z.number().optional(),
}).merge(ignoreQuerySchema);
