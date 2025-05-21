import {
  movieIdsRequestSchema,
} from '../../../_internal/request/idsRequestSchema.ts';
import { z } from '../../../_internal/z.ts';
import { sharingRequestSchema } from './sharingRequestSchema.ts';

export const movieCheckinRequestSchema = z.object({
  movie: z.object({
    title: z.string().optional(),
    year: z.number().int().optional(),
    ids: movieIdsRequestSchema,
  }),
  sharing: sharingRequestSchema,
  message: z.string().optional(),
});
