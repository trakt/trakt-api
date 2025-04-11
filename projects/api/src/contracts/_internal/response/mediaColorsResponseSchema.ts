import { z } from '../z.ts';

export const mediaColorsResponseSchema = z.object({
  poster: z.array(z.string()),
});
