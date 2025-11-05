import { z } from 'zod';
import { listMetadataResponseSchema } from './listMetadataResponseSchema.ts';
import { movieResponseSchema } from './movieResponseSchema.ts';
import { showResponseSchema } from './showResponseSchema.ts';

const listedShowSchema = listMetadataResponseSchema
  .merge(z.object({
    type: z.literal('show'),
    show: showResponseSchema.nullish(),
  }));

const listedMovieSchema = listMetadataResponseSchema
  .merge(z.object({
    type: z.literal('movie'),
    movie: movieResponseSchema.nullish(),
  }));

export const listedMediaResponseSchema = z.union([
  listedMovieSchema,
  listedShowSchema,
]);
