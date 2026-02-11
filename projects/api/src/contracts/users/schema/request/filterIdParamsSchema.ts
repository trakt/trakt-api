import { z } from '../../../_internal/z.ts';

export const filterIdParamsSchema = z.object({
  id: z.number().int().or(z.string()).describe(
    'ID of the saved filter',
  ),
});
