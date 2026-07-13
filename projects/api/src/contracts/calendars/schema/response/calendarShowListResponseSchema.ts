import { showResponseSchema } from '../../../_internal/response/showResponseSchema.ts';
import { z } from '../../../_internal/z.ts';
import { calendarEpisodeResponseSchema } from './calendarEpisodeResponseSchema.ts';

export const calendarShowResponseSchema = z.object({
  first_aired: z.string(),
  episode: calendarEpisodeResponseSchema,
  show: showResponseSchema,
});
