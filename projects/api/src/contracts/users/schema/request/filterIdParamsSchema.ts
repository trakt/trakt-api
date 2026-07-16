import { z } from '../../../_internal/z.ts';

/** Zod schema for the filter id parameters. */
export const filterIdParamsSchema = z.object({
  id: z.number().int().describe('ID of the saved filter'),
});
