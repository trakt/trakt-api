import { z } from '../z.ts';

export const hideFilterParamsSchema = z.object({
  hide: z.enum([
    'unwatched',
    'collected',
    'uncollected',
    'rated',
    'unrated',
    'unreleased',
    'noreleasedate',
    'ended',
    'airing',
    'unwatchlisted',
    'listed',
    'notes',
    'nonotes',
  ]).nullish(),
});
