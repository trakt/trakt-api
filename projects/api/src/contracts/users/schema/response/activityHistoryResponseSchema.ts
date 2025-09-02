import { z } from '../../../_internal/z.ts';

import { episodeActivityHistoryResponseSchema } from './episodeActivityHistoryResponseSchema.ts';
import { movieActivityHistoryResponseSchema } from './movieActivityHistoryResponseSchema.ts';

export const activityHistoryResponseSchema = z.discriminatedUnion('type', [
  movieActivityHistoryResponseSchema,
  episodeActivityHistoryResponseSchema,
]);
