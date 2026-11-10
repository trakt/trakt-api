import { z } from '../z.ts';

/** Zod schema for the award response. */
export const awardRefResponseSchema = z.object({
  slug: z.string(),
  name: z.string(),
});
