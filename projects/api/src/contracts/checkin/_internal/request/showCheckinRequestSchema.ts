import { showIdsRequestSchema } from '../../../_internal/request/idsRequestSchema.ts';
import { z } from '../../../_internal/z.ts';
import { sharingRequestSchema } from './sharingRequestSchema.ts';

const showAbsoluteCheckinRequestSchema = z.object({
  show: z.object({
    title: z.string().nullish(),
    year: z.number().int().nullish(),
    ids: showIdsRequestSchema,
  }),
  episode: z.object({ number_abs: z.number().int() }),
  sharing: sharingRequestSchema,
  message: z.string().nullish(),
});

const episodeCheckinRequestSchema = z.object({
  episode: z.object({ ids: showIdsRequestSchema }),
  sharing: sharingRequestSchema,
  message: z.string().nullish(),
});

const episodeWithShowCheckinRequestSchema = z.object({
  show: z.object({
    title: z.string().nullish(),
    year: z.number().int().nullish(),
    ids: showIdsRequestSchema,
  }),
  episode: z.object({ season: z.number().int(), number: z.number().int() }),
  sharing: sharingRequestSchema,
  message: z.string().nullish(),
});

export const showCheckinRequestSchema = z.union([
  episodeCheckinRequestSchema,
  showAbsoluteCheckinRequestSchema,
  episodeWithShowCheckinRequestSchema,
]);
