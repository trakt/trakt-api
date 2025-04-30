import { z } from '../../../_internal/z.ts';
import { sectionParamsSchema } from '../request/sectionParamsSchema.ts';

export const filterResponseSchema = z.object({
  rank: z.number(),
  id: z.number(),
  name: z.string(),
  path: z.string(),
  query: z.string(),
  updated_at: z.string(),
}).merge(sectionParamsSchema);
