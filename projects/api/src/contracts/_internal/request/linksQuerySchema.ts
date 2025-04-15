import { z } from '../z.ts';

export const linksQuerySchema = z.object({
  links: z.literal('tvos').optional(),
});
