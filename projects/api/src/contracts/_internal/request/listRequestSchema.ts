import { bulkMediaRequestSchema } from './bulkMediaRequestSchema.ts';

/**
 * FIXME: remove watched_at property from listRequestSchema
 * everything else is the same as historyRequestSchema
 */
export const listRequestSchema = bulkMediaRequestSchema;
