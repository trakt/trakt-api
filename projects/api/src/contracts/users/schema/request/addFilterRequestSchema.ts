import { z } from '../../../_internal/z.ts';

/** Zod schema for the add filter request. */
export const addFilterRequestSchema = z.object({
  name: z.string(),
  url: z.string(),
});
