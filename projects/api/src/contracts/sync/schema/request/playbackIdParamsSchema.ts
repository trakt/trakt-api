import { z } from '../../../_internal/z.ts';

/** Zod schema for the playback id parameters. */
export const playbackIdParamsSchema = z.object({
  id: z.number().int().describe('ID of the playback entry'),
});
