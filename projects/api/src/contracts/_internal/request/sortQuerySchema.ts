import { sortDirectionSchema } from '../response/sortDirectionSchema.ts';
import { z } from '../z.ts';

export const sortQuerySchema = z.object({
  sort_by: z.string().nullish().openapi({
    description: 'The field to sort by',
  }),
  sort_how: sortDirectionSchema.nullish().openapi({
    description: 'The direction to sort in',
    enum: ['asc', 'desc'],
  }),
});
