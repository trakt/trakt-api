import { showIdsRequestSchema } from '../../../_internal/request/idsRequestSchema.ts';
import { z } from '../../../_internal/z.ts';
import { sharingRequestSchema } from './sharingRequestSchema.ts';

const showAbsoluteCheckinRequestSchema = z.object({
  show: z.object({
    title: z.string().optional(),
    year: z.number().optional(),
    ids: showIdsRequestSchema,
  }),
  episode: z.object({ number_abs: z.number() }),
  sharing: sharingRequestSchema,
  message: z.string().optional(),
});

const episodeCheckinRequestSchema = z.object({
  episode: z.object({ ids: showIdsRequestSchema }),
  sharing: sharingRequestSchema,
  message: z.string().optional(),
});

const episodeWithShowCheckinRequestSchema = z.object({
  show: z.object({
    title: z.string().optional(),
    year: z.number().optional(),
    ids: showIdsRequestSchema,
  }),
  episode: z.object({ season: z.number(), number: z.number() }),
  sharing: sharingRequestSchema,
  message: z.string().optional(),
});

export const showCheckinRequestSchema = z.union([
  episodeCheckinRequestSchema,
  showAbsoluteCheckinRequestSchema,
  episodeWithShowCheckinRequestSchema,
]);
