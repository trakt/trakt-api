import { z } from '../../../_internal/z.ts';

/** Zod schema for hidden section. */
export const hiddenSectionSchema = z.enum([
  'calendar',
  'progress_watched',
  'progress_collected',
  'recommendations',
  'comments',
  'dropped',
]);
