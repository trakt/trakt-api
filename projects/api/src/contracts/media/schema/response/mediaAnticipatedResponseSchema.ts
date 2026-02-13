import { z } from '../../../_internal/z.ts';
import { movieAnticipatedResponseSchema } from '../../../movies/index.ts';
import { showAnticipatedResponseSchema } from '../../../shows/index.ts';

export const mediaAnticipatedResponseSchema = z.union([
  movieAnticipatedResponseSchema,
  showAnticipatedResponseSchema,
]);
