import { z } from '../../../_internal/z.ts';

export const playbackIdParamsSchema = z.object({
  id: z.number().int().describe('ID of the playback entry'),
});
