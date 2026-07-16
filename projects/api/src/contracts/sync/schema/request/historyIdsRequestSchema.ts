import { int64, z } from '../../../_internal/z.ts';

/** Zod schema for the history ids request. */
export const historyIdsRequestSchema = z.object({
  ids: z.array(int64(z.number().int())).nullish(),
});
