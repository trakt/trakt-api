import { z } from '../../../_internal/z.ts';
import { sectionParamsSchema } from '../request/sectionParamsSchema.ts';

export const filterResponseSchema = z.object({
  rank: z.number().int(),
  id: z.number().int(),
  name: z.string(),
  path: z.string(),
  query: z.string(),
  updated_at: z.string().datetime(),
}).merge(sectionParamsSchema);
