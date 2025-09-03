import type { z } from '../_internal/z.ts';
import { crewPositionSchema } from './crewPositionSchema.ts';
import { genreOptionSchema } from './genreOptionSchema.ts';
import { jobOptionSchema } from './jobOptionSchema.ts';
import { mediaStatusSchema } from './mediaStatusSchema.ts';
import { reactionsSchema } from './reactionsSchema.ts';
import { upNextSortOptionSchema } from './upNextSortOptionSchema.ts';
import { videoTypeSchema } from './videoTypeSchema.ts';

export { crewPositionSchema };
export type CrewPosition = z.infer<typeof crewPositionSchema>;

export { genreOptionSchema };
export type GenreOption = z.infer<typeof genreOptionSchema>;

export { jobOptionSchema };
export type JobOption = z.infer<typeof jobOptionSchema>;

export { mediaStatusSchema };
export type MediaStatus = z.infer<typeof mediaStatusSchema>;

export { reactionsSchema };
export type Reactions = z.infer<typeof reactionsSchema>;

export { upNextSortOptionSchema };
export type UpNextSortOption = z.infer<typeof upNextSortOptionSchema>;

export { videoTypeSchema };
export type VideoType = z.infer<typeof videoTypeSchema>;
