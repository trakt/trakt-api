import { extendedQuerySchemaFactory } from './extendedQuerySchemaFactory.ts';

/** Zod schema for the extended people query parameters. */
export const extendedPeopleQuerySchema = extendedQuerySchemaFactory<
  ['full', 'images']
>();
