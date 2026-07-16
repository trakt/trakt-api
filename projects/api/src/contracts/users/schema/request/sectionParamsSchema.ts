import { z } from '../../../_internal/z.ts';

/** Zod schema for the section parameters. */
export const sectionParamsSchema = z.object({
  section: z.enum([
    'movies',
    'shows',
    'calendars',
    'search',
  ]),
});
