import type { z } from '../_internal/z.ts';
import { crewPositionSchema } from './crewPositionSchema.ts';
import { genreOptionSchema } from './genreOptionSchema.ts';
import { mediaStatusSchema } from './mediaStatusSchema.ts';
import { reactionsSchema } from './reactionsSchema.ts';
import { upNextSortOptionSchema } from './upNextSortOptionSchema.ts';
import { videoTypeSchema } from './videoTypeSchema.ts';

export { crewPositionSchema };
/** The crew position type. */
export type CrewPosition = z.infer<typeof crewPositionSchema>;

export { genreOptionSchema };
/** The genre option type. */
export type GenreOption = z.infer<typeof genreOptionSchema>;

export { mediaStatusSchema };
/** The media status type. */
export type MediaStatus = z.infer<typeof mediaStatusSchema>;

export { reactionsSchema };
/** The reactions type. */
export type Reactions = z.infer<typeof reactionsSchema>;

export { upNextSortOptionSchema };
/** The up next sort option type. */
export type UpNextSortOption = z.infer<typeof upNextSortOptionSchema>;

export { videoTypeSchema };
/** The video type type. */
export type VideoType = z.infer<typeof videoTypeSchema>;
