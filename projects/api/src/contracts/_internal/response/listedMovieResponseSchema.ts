import { listMetadataResponseSchema } from './listMetadataResponseSchema.ts';
import { typedMovieResponseSchema } from './movieResponseSchema.ts';

export const listedMovieResponseSchema = listMetadataResponseSchema
  .merge(typedMovieResponseSchema);
