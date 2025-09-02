import { z } from '../../../_internal/z.ts';

export const watchNowSourceResponseSchema = z.object({
  source: z.string(),
  name: z.string(),
  free: z.boolean(),
  cinema: z.boolean(),
  amazon: z.boolean(),
  color: z.string(),
  link_count: z.number().int(),
  images: z.object({
    logo: z.string().nullish(),
    channel: z.string().nullish(),
  }),
});

export const watchNowSourcesResponseSchema = z.record(
  z.string(),
  z.array(watchNowSourceResponseSchema),
);
