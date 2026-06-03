import { z } from '../../../_internal/z.ts';

export const syncIdParamsSchema = z.object({
  id: z.number().int().openapi({
    description:
      'The numeric sync id, scoped to the authenticated user. A numeric segment hits a single sync; a non-numeric segment is the filtered list.',
  }),
});
