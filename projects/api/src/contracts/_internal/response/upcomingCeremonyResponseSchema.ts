import { z } from '../z.ts';
import { awardRefResponseSchema } from './awardRefResponseSchema.ts';

/** Zod schema for an upcoming award ceremony response. */
export const upcomingCeremonyResponseSchema = awardRefResponseSchema.extend({
  edition: z.number().int(),
  year: z.number().int(),
  nominations_at: z.string().nullable(),
  held_at: z.string(),
});
