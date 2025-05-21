import { characterResponseSchema } from '../../../_internal/response/characterResponseSchema.ts';
import { crewPositionResponseSchema } from '../../../_internal/response/crewPositionResponseSchema.ts';
import { jobsResponseSchema } from '../../../_internal/response/jobsResponseSchema.ts';
import { showResponseSchema } from '../../../_internal/response/showResponseSchema.ts';
import { z } from '../../../_internal/z.ts';

export const peopleShowCreditsResponseSchema = z.object({
  cast: z.array(
    z.object({
      show: showResponseSchema,
      episode_count: z.number().int(),
      series_regular: z.boolean(),
    }).merge(characterResponseSchema),
  ).optional(),
  crew: z.record(
    crewPositionResponseSchema,
    z.array(
      z.object({
        show: showResponseSchema,
        episode_count: z.number().int(),
      }).merge(jobsResponseSchema),
    ),
  ).optional(),
});
