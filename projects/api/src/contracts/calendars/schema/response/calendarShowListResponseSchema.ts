import { episodeResponseSchema } from '../../../_internal/response/episodeResponseSchema.ts';
import { showResponseSchema } from '../../../_internal/response/showResponseSchema.ts';
import { z } from '../../../_internal/z.ts';

export const calendarShowResponseSchema = z.object({
  first_aired: z.string(),
  episode: episodeResponseSchema,
  show: showResponseSchema,
});
