import { z } from '../z.ts';

export const distributionResponseSchema = z.object({
  1: z.number().finite(),
  2: z.number().finite(),
  3: z.number().finite(),
  4: z.number().finite(),
  5: z.number().finite(),
  6: z.number().finite(),
  7: z.number().finite(),
  8: z.number().finite(),
  9: z.number().finite(),
  10: z.number().finite(),
});
