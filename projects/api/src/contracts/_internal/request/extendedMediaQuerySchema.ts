import { extendedQuerySchemaFactory } from './extendedQuerySchemaFactory.ts';

export const extendedMediaQuerySchema = extendedQuerySchemaFactory<['full', 'images', 'colors']>()