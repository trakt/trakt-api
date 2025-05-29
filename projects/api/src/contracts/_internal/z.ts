import { extendZodWithOpenApi } from '@anatine/zod-openapi';
import { z, type ZodTypeDef } from 'zod';

declare module 'zod' {
  // skipcq: JS-0323, JS-0356
  // deno-lint-ignore no-explicit-any
  interface ZodSchema<Output = any, Def extends ZodTypeDef = ZodTypeDef, Input = Output> {
    /**
     * Marks a number as a float in OpenAPI metadata.
     * This doesn't change the runtime validation behavior,
     * but adds OpenAPI metadata for documentation and client generation.
     * 
     * @returns The same ZodType instance with OpenAPI metadata
     */
    float(): this;

  }
}


/**
 * TODO: https://ts-rest.com/docs/open-api
 * extend with open-api metadata
 */
extendZodWithOpenApi(z);

/**
 * Extends ZodType with a float() method that adds OpenAPI metadata
 * for documenting number fields as floating point values.
 */
Object.defineProperty(z.ZodType.prototype, 'float', {
  value() {
    return this.openapi({
      type: 'number',
      format: 'float',
    });
  },
  writable: true,
  configurable: true,
  enumerable: false,
});

export { z };
