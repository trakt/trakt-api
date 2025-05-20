import { extendZodWithOpenApi } from '@anatine/zod-openapi';
import { z } from 'zod';

/**
 * TODO: https://ts-rest.com/docs/open-api
 * extend with open-api metadata
 */
extendZodWithOpenApi(z);
export { z };
