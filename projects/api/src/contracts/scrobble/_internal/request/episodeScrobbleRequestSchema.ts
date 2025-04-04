import {
  episodeIdsRequestSchema,
} from '../../../_internal/request/idsRequestSchema.ts';
import { z } from '../../../_internal/z.ts';

export const episodeScrobbleRequestSchema = z.object({
  progress: z.number(),
  episode: z.object({
    ids: episodeIdsRequestSchema,
  }),
});
