import { extendedQuerySchemaFactory } from './extendedQuerySchemaFactory.ts';

export const extendedProfileQuerySchema = extendedQuerySchemaFactory<['full', 'vip']>();
