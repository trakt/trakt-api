import { z } from '../../../_internal/z.ts';

export const playbackIdParamsSchema = z.object({
  id: z.number().int().or(z.string()).describe(
    'ID of the playback entry',
  ),
});
