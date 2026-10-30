import { mediaItemsRequestSchemaFactory } from './mediaItemsRequestSchemaFactory.ts';

/** Zod schema for the bulk media items request without per-item extras. */
export const mediaItemsRequestSchema = mediaItemsRequestSchemaFactory({});
