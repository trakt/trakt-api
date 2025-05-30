import { characterResponseSchema } from '../../../_internal/response/characterResponseSchema.ts';
import { crewPositionResponseSchema } from '../../../_internal/response/crewPositionResponseSchema.ts';
import { jobsResponseSchema } from '../../../_internal/response/jobsResponseSchema.ts';
import { movieResponseSchema } from '../../../_internal/response/movieResponseSchema.ts';
import { z } from '../../../_internal/z.ts';

export const peopleMovieCreditsResponseSchema = z.object({
  cast: z.array(
    z.object({
      movie: movieResponseSchema,
    }).merge(characterResponseSchema),
  ).nullish(),
  crew: z.record(
    crewPositionResponseSchema,
    z.array(
      z.object({
        movie: movieResponseSchema,
      }).merge(jobsResponseSchema),
    ),
  ).nullish(),
});
