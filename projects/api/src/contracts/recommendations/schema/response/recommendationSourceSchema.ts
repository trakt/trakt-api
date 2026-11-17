import { movieResponseSchema } from '../../../_internal/response/movieResponseSchema.ts';
import { showResponseSchema } from '../../../_internal/response/showResponseSchema.ts';
import { z } from '../../../_internal/z.ts';

/** Zod schema for a subgenre a recommendation was matched on. */
export const recommendationSubgenreSchema = z.object({
  id: z.number().int(),
  name: z.string(),
  slug: z.string(),
});

/** Zod schema for the title a recommendation was drawn from. */
export const recommendationSourceSchema = z.object({
  id: z.number().int(),
  type: z.enum(['activity', 'favorite', 'subgenre']),
  stars: z.number().nullable(),
  movie: movieResponseSchema.nullish(),
  show: showResponseSchema.nullish(),
  subgenres: z.array(recommendationSubgenreSchema).nullish(),
});
