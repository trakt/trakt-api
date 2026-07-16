import { z } from '../../../_internal/z.ts';

/** Zod schema for the history item id parameters. */
export const historyItemIdParamsSchema = z.object({
  item_id: z.string(),
});
