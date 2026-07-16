import { z } from '../../../_internal/z.ts';
import { addFilterRequestSchema } from '../request/addFilterRequestSchema.ts';
import { filterResponseSchema } from './filterResponseSchema.ts';

/** Zod schema for the add filter response. */
export const addFilterResponseSchema = z.object({
  added: filterResponseSchema.array(),
  skipped: addFilterRequestSchema.array(),
});
