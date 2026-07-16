import { listMetadataResponseSchema } from './listMetadataResponseSchema.ts';
import { typedMovieResponseSchema } from './movieResponseSchema.ts';

/** Zod schema for the listed movie response. */
export const listedMovieResponseSchema = listMetadataResponseSchema
  .merge(typedMovieResponseSchema);
