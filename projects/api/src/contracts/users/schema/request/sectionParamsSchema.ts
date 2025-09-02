import { z } from '../../../_internal/z.ts';

export const sectionParamsSchema = z.object({
  section: z.enum([
    'movies',
    'shows',
    'calendars',
    'search',
  ]),
});
