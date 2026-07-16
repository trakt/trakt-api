import { extendedQuerySchemaFactory } from './extendedQuerySchemaFactory.ts';

/** Zod schema for the extended watch now query parameters. */
export const extendedWatchNowQuerySchema = extendedQuerySchemaFactory<
  ['streaming_ranks']
>();
