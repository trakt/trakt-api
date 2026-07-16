import { z } from '../../../_internal/z.ts';
import { movieAnticipatedResponseSchema } from '../../../movies/index.ts';
import { showAnticipatedResponseSchema } from '../../../shows/index.ts';

/** Zod schema for the media anticipated response. */
export const mediaAnticipatedResponseSchema = z.union([
  movieAnticipatedResponseSchema,
  showAnticipatedResponseSchema,
]);
