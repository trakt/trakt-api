import { z } from '../../../_internal/z.ts';

/** Zod schema for the list parameters. */
export const listParamsSchema = z.object({
  list_id: z.string(),
});
