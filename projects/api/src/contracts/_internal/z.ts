import { extendZodWithOpenApi } from '@anatine/zod-openapi';
import { z } from 'zod';

// Extend zod with the OpenAPI capabilities
extendZodWithOpenApi(z);

/**
 * Helper function to mark a number schema as a float in OpenAPI metadata
 */
export function float(schema: z.ZodNumber) {
  // Use type assertion to access the openapi method added by extendZodWithOpenApi
  return (schema as z.ZodNumber & { openapi: (meta: unknown) => z.ZodNumber })
    .openapi({
      type: 'number',
      format: 'float',
    });
}

/**
 * Helper function to force a schema to be treated as a string in OpenAPI metadata
 */
export function asString<T extends z.ZodEnum<[string, ...string[]]>>(
  schema: T,
) {
  // Use type assertion to access the openapi method
  return (schema as T & { openapi: (meta: unknown) => T })
    .openapi({
      type: 'string',
      enum: undefined,
    });
}

export { z };
