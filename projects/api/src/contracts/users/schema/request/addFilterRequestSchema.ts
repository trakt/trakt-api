import { z } from '../../../_internal/z.ts';

export const addFilterRequestSchema = z.object({
  name: z.string(),
  url: z.string(),
});
