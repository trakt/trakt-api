import { z } from '../../../_internal/z.ts';

export const calendarRequestParamsSchema = z.object({
  target: z.enum(['my', 'all']).openapi({
    description:
      `Use "my" for all items that have been watched, collected, or watchlisted plus individual episodes on the watchlist.
      Use "all" for all items items airing during the specified period.`,
  }),
  start_date: z.string().openapi({
    description:
      'The start date of the calendar. Must be formatted as "YYYY-MM-DD".',
  }),
  days: z.number().int().openapi({
    description: 'The number of days to retrieve.',
  }),
});
