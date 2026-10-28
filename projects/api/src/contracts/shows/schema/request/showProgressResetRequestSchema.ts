import { z } from '../../../_internal/z.ts';

/** Zod schema for the show progress reset request body. */
export const showProgressResetRequestSchema = z.object({
  reset_at: z.string().datetime().nullish().openapi({
    description:
      'UTC datetime the reset starts from; defaults to now. Cannot be in the future.',
  }),
});
