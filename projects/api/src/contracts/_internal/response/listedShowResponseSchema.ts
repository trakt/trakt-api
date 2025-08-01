import { listMetadataResponseSchema } from './listMetadataResponseSchema.ts';
import { typedShowResponseSchema } from './showResponseSchema.ts';

export const listedShowResponseSchema = listMetadataResponseSchema
  .merge(typedShowResponseSchema);
