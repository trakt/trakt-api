import { z } from '../z.ts';
import { awardRefResponseSchema } from './awardRefResponseSchema.ts';

/** Zod schema for the award ceremony response. */
export const awardCeremonyResponseSchema = awardRefResponseSchema.extend({
  edition: z.number().int().nullable(),
  nominations_at: z.string().nullable(),
  held_at: z.string().nullable(),
});
