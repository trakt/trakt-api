import { z } from '../../../_internal/z.ts';

/** Zod schema for minimal param. */
export const minimalParamSchema = z.object({
  extended: z.literal('min'),
});
