import { movieResponseSchema } from '../../../_internal/response/movieResponseSchema.ts';
import { showResponseSchema } from '../../../_internal/response/showResponseSchema.ts';
import { z } from '../../../_internal/z.ts';
import { personResponseSchema } from '../../../people/schema/response/personResponseSchema.ts';

const roleSchema = z.enum(['directing', 'making', 'acting']);

/** Zod schema for a person a recommendation was matched on. */
export const recommendationPeopleReasonSchema = z.object({
  person: personResponseSchema,
  role: roleSchema,
  watched_roles: z.array(roleSchema),
  watched_count: z.number().int(),
  titles: z.array(
    z.object({
      movie: movieResponseSchema.nullish(),
      show: showResponseSchema.nullish(),
    }),
  ),
});
