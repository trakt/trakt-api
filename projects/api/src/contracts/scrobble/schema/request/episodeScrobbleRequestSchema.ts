import {
  episodeIdsRequestSchema,
} from '../../../_internal/request/idsRequestSchema.ts';
import {float, z} from '../../../_internal/z.ts';

export const episodeScrobbleRequestSchema = z.object({
  progress: float(z.number()),
  episode: z.object({
    ids: episodeIdsRequestSchema,
  }).nullish(),
});
