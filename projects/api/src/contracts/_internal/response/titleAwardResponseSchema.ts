import { personResponseSchema } from '../../people/schema/response/personResponseSchema.ts';
import { z } from '../z.ts';
import { awardCeremonyResponseSchema } from './awardCeremonyResponseSchema.ts';
import { awardRefResponseSchema } from './awardRefResponseSchema.ts';

/** Zod schema for a title award response. */
export const titleAwardResponseSchema = z.object({
  award: awardRefResponseSchema,
  ceremony: awardCeremonyResponseSchema,
  year: z.number().int(),
  /***
   * `null` while the ceremony results are pending.
   */
  won: z.boolean().nullable(),
  /***
   * Present when the award went to a person credited on the title.
   */
  person: personResponseSchema.pick({ name: true, ids: true }).optional(),
});
