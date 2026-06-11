import { z } from '../z.ts';

export const refreshQuerySchema = z.object({
  images: z.boolean().nullish().openapi({
    description: 'Also queue a refresh of the resource images.',
  }),
});
