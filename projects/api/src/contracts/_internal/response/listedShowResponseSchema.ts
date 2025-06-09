import { z } from '../z.ts';
import { listMetadataResponseSchema } from './listMetadataResponseSchema.ts';
import { showResponseSchema } from './showResponseSchema.ts';

export const listedShowResponseSchema = listMetadataResponseSchema
  .extend({
    show: showResponseSchema.nullish(),
    type: z.literal('show'),
  });
