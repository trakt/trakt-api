import { z } from '../z.ts';

/** Zod schema for the internal id parameters. */
export const internalIdParamsSchema = z.object({
  id: z.string(),
});
