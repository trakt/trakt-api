import { extendedQuerySchemaFactory } from './extendedQuerySchemaFactory.ts';

/** Zod schema for the extended query parameters of a single person. */
export const extendedPersonQuerySchema =
  extendedQuerySchemaFactory<['full', 'images', 'markdown']>();
