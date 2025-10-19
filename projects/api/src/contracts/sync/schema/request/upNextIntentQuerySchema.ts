import { z } from '../../../_internal/z.ts';

export const upNextIntentQuerySchema = z.object({
  intent: z.enum(['all', 'continue', 'start']).optional().openapi({
    description:
      'To get shows a user is just starting, continuing, or all shows.',
  }),
});
