import { z } from '../z.ts';

export const idParamsSchema = z.object({
  id: z.string().openapi({
    description: 'The slug of the resource.',
  }),
});
