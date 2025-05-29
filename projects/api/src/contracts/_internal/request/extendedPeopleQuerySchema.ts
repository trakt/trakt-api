import { extendedQuerySchemaFactory } from './extendedQuerySchemaFactory.ts';

export const extendedPeopleQuerySchema = extendedQuerySchemaFactory<['full', 'images']>();
