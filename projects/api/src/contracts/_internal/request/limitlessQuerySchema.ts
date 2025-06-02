import { z } from '../z.ts';

export const limitlessQuerySchema = z.object({
  limit: z.number()
    .int()
    .or(z.literal('all'))
    .optional().openapi({
      description: 'The number of items per page',
    }),
});
