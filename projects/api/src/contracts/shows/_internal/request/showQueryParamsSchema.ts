import { z } from '../../../_internal/z.ts';

export const showQueryParamsSchema = z.object({
  hidden: z.boolean().optional().openapi({
    description: 'Whether to include any hidden seasons',
  }),
  specials: z.boolean().optional().openapi({
    description: 'Whether to include special seasons as season 0.',
  }),
  count_specials: z.boolean().optional().openapi({
    description:
      'Whether to count specials in the overall stats (only applies if specials are included).',
  }),
});
