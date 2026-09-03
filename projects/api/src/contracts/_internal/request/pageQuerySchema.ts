import { z } from '../z.ts';

/** Zod schema for the page query parameters. */
export const pageQuerySchema = z.object({
  page: z.number().int().nullish().openapi({
    description: 'The page number to retrieve',
  }),
  limit: z.number().int().nullish().openapi({
    description:
      'The number of items per page. Defaults and maximums vary by endpoint. When pagination parameters are omitted, a low default limit is applied (often 10). When a limit is provided, it is capped at the endpoint maximum (often 250); higher values are clamped rather than rejected.',
  }),
});
