import { z } from '../z.ts';

export const distributionResponseSchema = z.object({
  1: z.number().openapi({
    type: 'number',
    format: 'float',
  }),
  2: z.number().openapi({
    type: 'number',
    format: 'float',
  }),
  3: z.number().openapi({
    type: 'number',
    format: 'float',
  }),
  4: z.number().openapi({
    type: 'number',
    format: 'float',
  }),
  5: z.number().openapi({
    type: 'number',
    format: 'float',
  }),
  6: z.number().openapi({
    type: 'number',
    format: 'float',
  }),
  7: z.number().openapi({
    type: 'number',
    format: 'float',
  }),
  8: z.number().openapi({
    type: 'number',
    format: 'float',
  }),
  9: z.number().openapi({
    type: 'number',
    format: 'float',
  }),
  10: z.number().openapi({
    type: 'number',
    format: 'float',
  }),
});
