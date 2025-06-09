import { z } from '../z.ts';
import { listMetadataResponseSchema } from './listMetadataResponseSchema.ts';
import { movieResponseSchema } from './movieResponseSchema.ts';

export const listedMovieResponseSchema = listMetadataResponseSchema
  .extend({
    movie: movieResponseSchema.nullish(),
    type: z.literal('movie'),
  });
