import { z } from '../z.ts';

export const internalIdParamsSchema = z.object({
  id: z.string(),
});
