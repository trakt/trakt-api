import { z } from '../../../_internal/z.ts';

export const historyItemIdParamsSchema = z.object({
  item_id: z.string().optional(),
});
