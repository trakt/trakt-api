import { float, z } from '../z.ts';

export const distributionResponseSchema = z.object({
  1: float(z.number()),
  2: float(z.number()),
  3: float(z.number()),
  4: float(z.number()),
  5: float(z.number()),
  6: float(z.number()),
  7: float(z.number()),
  8: float(z.number()),
  9: float(z.number()),
  10: float(z.number()),
});
