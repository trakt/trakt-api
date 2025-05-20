import { z } from '../z.ts';
import { countryParamsSchema } from './countryParamsSchema.ts';

export const watchNowParamsSchema = z.object({
  id: z.string().or(z.number()).openapi({
    description:
      'The Trakt ID of the resource to get the watch now sources of.',
  }),
}).merge(countryParamsSchema);
