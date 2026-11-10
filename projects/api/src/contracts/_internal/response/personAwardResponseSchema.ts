import { z } from '../z.ts';
import { awardCeremonyResponseSchema } from './awardCeremonyResponseSchema.ts';
import { awardRefResponseSchema } from './awardRefResponseSchema.ts';
import { movieResponseSchema } from './movieResponseSchema.ts';
import { showResponseSchema } from './showResponseSchema.ts';

const personAwardBaseSchema = z.object({
  award: awardRefResponseSchema,
  ceremony: awardCeremonyResponseSchema,
  year: z.number().int(),
  /***
   * `null` while the ceremony results are pending.
   */
  won: z.boolean().nullable(),
});

/** Zod schema for a person award response, for either a movie or a show. */
export const personAwardResponseSchema = z.union([
  personAwardBaseSchema.extend({
    movie: movieResponseSchema.pick({ title: true, year: true, ids: true }),
  }),
  personAwardBaseSchema.extend({
    show: showResponseSchema.pick({ title: true, year: true, ids: true }),
  }),
]);
