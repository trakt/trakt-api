import { extendedQuerySchemaFactory } from './extendedQuerySchemaFactory.ts';

/** Zod schema for the extended profile query parameters. */
export const extendedProfileQuerySchema = extendedQuerySchemaFactory<
  ['full', 'images', 'vip']
>();
