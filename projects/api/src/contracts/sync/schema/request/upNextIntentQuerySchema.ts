import { z } from '../../../_internal/z.ts';

/** Zod schema for the up next intent query parameters. */
export const upNextIntentQuerySchema = z.object({
  intent: z.enum(['all', 'continue', 'start', 'completed']).optional().openapi({
    description:
      'To get shows a user is just starting, continuing, completed, or all shows.',
  }),
});
