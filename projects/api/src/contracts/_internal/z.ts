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
 * Helper function to mark a number schema as a double in OpenAPI metadata
 */
export function int64(schema: z.ZodNumber) {
  // Use type assertion to access the openapi method added by extendZodWithOpenApi
  return (schema as z.ZodNumber & { openapi: (meta: unknown) => z.ZodNumber })
    .openapi({
      type: 'number',
      format: 'int64',
    });
}

/**
 * Helper function to force a schema to be treated as a string in OpenAPI metadata
 */
export function asString<T extends z.ZodEnum<[string, ...string[]]>>(
  schema: T,
): z.ZodString {
  // The inferred output must stay `string`, not the literal union: consumers
  // bind their own zod for the @anatine/zod-openapi peer, and under zod 4 the
  // enum would otherwise leak as a literal union and break assignments from
  // plain string data. Runtime keeps validating enum membership.
  return (schema as unknown as z.ZodString & {
    openapi: (meta: unknown) => z.ZodString;
  })
    .openapi({
      type: 'string',
      enum: undefined,
    });
}

export { z };
