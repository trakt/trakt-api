import { extendedQuerySchemaFactory } from './extendedQuerySchemaFactory.ts';

/** Zod schema for the extended media query parameters. */
export const extendedMediaQuerySchema = extendedQuerySchemaFactory<
  ['full', 'images', 'colors', 'streaming_ids']
>();
