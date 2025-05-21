import { ignoreQuerySchema } from '../../../_internal/request/ignoreQuerySchema.ts';
import { z } from '../../../_internal/z.ts';

export const recommendationsQuerySchema = z.object({
  limit: z.number().int().openapi({
    description: 'Limit the number of results.',
  }),
  watch_window: z.number().int().optional().openapi({
    description: 'The watch window in days for the recommendations.',
  }),
}).merge(ignoreQuerySchema);
