import { int64, z } from '../../../_internal/z.ts';
import { personResponseSchema } from './personResponseSchema.ts';

/** Zod schema for the people-with-birthdays-this-month response. */
export const peopleThisMonthResponseSchema = personResponseSchema.extend({
  type: z.literal('person'),
  score: int64(z.number().int()),
});
