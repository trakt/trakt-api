import { z } from '../../../_internal/z.ts';
import { addFilterRequestSchema } from '../request/addFilterRequestSchema.ts';
import { filterResponseSchema } from './filterResponseSchema.ts';

export const addFilterResponseSchema = z.object({
  added: filterResponseSchema.array(),
  skipped: addFilterRequestSchema.array(),
});
