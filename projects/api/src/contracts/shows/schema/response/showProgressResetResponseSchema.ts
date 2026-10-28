import { z } from '../../../_internal/z.ts';

/** Zod schema for the show progress reset response. */
export const showProgressResetResponseSchema = z.object({
  reset_at: z.string().datetime(),
});
