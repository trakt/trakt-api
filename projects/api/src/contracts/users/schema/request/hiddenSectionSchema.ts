import { z } from '../../../_internal/z.ts';

export const hiddenSectionSchema = z.enum([
  'calendar',
  'progress_watched',
  'progress_collected',
  'recommendations',
  'comments',
  'dropped',
]);
