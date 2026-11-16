import { z } from '../../../_internal/z.ts';

/** Zod schema for the show certification entry response. */
export const showCertificationEntryResponseSchema = z.object({
  certification: z.string(),
  country: z.string(),
});
