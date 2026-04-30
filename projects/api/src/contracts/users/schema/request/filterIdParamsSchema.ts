import { z } from '../../../_internal/z.ts';

export const filterIdParamsSchema = z.object({
  id: z.number().int().describe('ID of the saved filter'),
});
