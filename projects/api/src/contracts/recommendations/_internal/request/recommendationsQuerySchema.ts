import { ignoreQuerySchema } from '../../../_internal/request/ignoreQuerySchema.ts';
import { z } from '../../../_internal/z.ts';

export const recommendationsQuerySchema = z.object({
  limit: z.number().openapi({
    description: 'Limit the number of results.',
  }),
  watch_window: z.number().optional().openapi({
    description: 'The watch window in days for the recommendations.',
  }),
}).merge(ignoreQuerySchema);
