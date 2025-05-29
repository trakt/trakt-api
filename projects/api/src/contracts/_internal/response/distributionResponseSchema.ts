import { z } from '../z.ts';

export const distributionResponseSchema = z.object({
  1: z.number().float(),
  2: z.number().float(),
  3: z.number().float(),
  4: z.number().float(),
  5: z.number().float(),
  6: z.number().float(),
  7: z.number().float(),
  8: z.number().float(),
  9: z.number().float(),
  10: z.number().float(),
});
