import { z } from '../z.ts';

export const upNextSortBySchema = z.enum([
  'activity',
  'added',
  'completed',
  'episodes',
  'time',
  'plays',
  'released',
  'premiered',
  'title',
  'popularity',
  'runtime',
  'total-runtime',
  'recently-aired',
  'random',
]);
