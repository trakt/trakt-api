import { mediaItemsRequestSchema } from '../../../_internal/request/mediaItemsRequestSchema.ts';
import { z } from '../../../_internal/z.ts';

/** Zod schema for the collection remove response. */
export const collectionRemoveResponseSchema = z.object({
  deleted: z.object({ movies: z.number().int(), episodes: z.number().int() }),
  not_found: mediaItemsRequestSchema,
});
