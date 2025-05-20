import { z } from '../z.ts';

export const pageQuerySchema = z.object({
  page: z.number().optional().openapi({
    description: 'The page number to retrieve',
  }),
  limit: z.number().optional().openapi({
    description: 'The number of items per page',
  }),
});
