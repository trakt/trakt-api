import { z } from '../../../_internal/z.ts';

export const listParamsSchema = z.object({
  list_id: z.string(),
});
