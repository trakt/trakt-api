import { bulkMediaRequestSchema } from '../../../_internal/request/bulkMediaRequestSchema.ts';
import { historyIdsRequestSchema } from './historyIdsRequestSchema.ts';

export const historyRemoveRequestSchema = bulkMediaRequestSchema
  .merge(historyIdsRequestSchema);
