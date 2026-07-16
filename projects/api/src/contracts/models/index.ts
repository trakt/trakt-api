import { commentResponseSchema } from '../_internal/response/commentResponseSchema.ts';
import { episodeResponseSchema } from '../_internal/response/episodeResponseSchema.ts';
import { episodeStatsResponseSchema } from '../_internal/response/episodeStatsResponseSchema.ts';
import { episodeTranslationResponseSchema } from '../_internal/response/episodeTranslationResponseSchema.ts';
import { justWatchLinkResponseSchema } from '../_internal/response/justWatchLinkResponseSchema.ts';
import { listAddResponseSchema } from '../_internal/response/listAddResponseSchema.ts';
import {
  listedAllResponseSchema,
  listedMediaResponseSchema,
} from '../_internal/response/listedMediaResponseSchema.ts';
import { listedMovieResponseSchema } from '../_internal/response/listedMovieResponseSchema.ts';
import { listedShowResponseSchema } from '../_internal/response/listedShowResponseSchema.ts';
import { listRemoveResponseSchema } from '../_internal/response/listRemoveResponseSchema.ts';
import { listResponseSchema } from '../_internal/response/listResponseSchema.ts';
import {
  castResponseSchema,
  crewResponseSchema,
  peopleResponseSchema,
} from '../_internal/response/peopleResponseSchema.ts';
import { profileResponseSchema } from '../_internal/response/profileResponseSchema.ts';
import { ratingsResponseSchema } from '../_internal/response/ratingsResponseSchema.ts';
import { sentimentsResponseSchema } from '../_internal/response/sentimentsResponseSchema.ts';
import { socialIdsResponseSchema } from '../_internal/response/socialIdsResponseSchema.ts';
import { statusResponseSchema } from '../_internal/response/statusResponseSchema.ts';
import { studioResponseSchema } from '../_internal/response/studioResponseSchema.ts';
import { translationResponseSchema } from '../_internal/response/translationResponseSchema.ts';
import { videoResponseSchema } from '../_internal/response/videoResponseSchema.ts';
import { watchNowResponseSchema } from '../_internal/response/watchNowResponseSchema.ts';
import type { z } from '../_internal/z.ts';

export { commentResponseSchema };
/** The comment response payload. */
export type CommentResponse = z.infer<typeof commentResponseSchema>;

export { episodeResponseSchema };
/** The episode response payload. */
export type EpisodeResponse = z.infer<typeof episodeResponseSchema>;

export { episodeStatsResponseSchema };
/** The episode stats response payload. */
export type EpisodeStatsResponse = z.infer<typeof episodeStatsResponseSchema>;

export { episodeTranslationResponseSchema };
/** The episode translation response payload. */
export type EpisodeTranslationResponse = z.infer<
  typeof episodeTranslationResponseSchema
>;

/** The likes response payload. */
export type LikesResponse = z.infer<typeof episodeResponseSchema>;

export { listAddResponseSchema };
/** The list add response payload. */
export type ListAddResponse = z.infer<typeof listAddResponseSchema>;

export { listedMovieResponseSchema };
/** The listed movie response payload. */
export type ListedMovieResponse = z.infer<
  typeof listedMovieResponseSchema
>;

export { listedShowResponseSchema };
/** The listed show response payload. */
export type ListedShowResponse = z.infer<
  typeof listedShowResponseSchema
>;

export { listedMediaResponseSchema };
/** The listed media response payload. */
export type ListedMediaResponse = z.infer<
  typeof listedMediaResponseSchema
>;

export { listedAllResponseSchema };
/** The listed all response payload. */
export type ListedAllResponse = z.infer<
  typeof listedAllResponseSchema
>;

export { listRemoveResponseSchema };
/** The list remove response payload. */
export type ListRemoveResponse = z.infer<
  typeof listRemoveResponseSchema
>;

export { listResponseSchema };
/** The list response payload. */
export type ListResponse = z.infer<typeof listResponseSchema>;

export { peopleResponseSchema };
/** The people response payload. */
export type PeopleResponse = z.infer<typeof peopleResponseSchema>;

export { crewResponseSchema };
/** The crew response payload. */
export type CrewResponse = z.infer<typeof crewResponseSchema>;

export { castResponseSchema };
/** The cast response payload. */
export type CastResponse = z.infer<typeof castResponseSchema>;

export { ratingsResponseSchema };
/** The ratings response payload. */
export type RatingsResponse = z.infer<typeof ratingsResponseSchema>;

export { sentimentsResponseSchema };
/** The sentiments response payload. */
export type SentimentsResponse = z.infer<typeof sentimentsResponseSchema>;

export { statusResponseSchema };
/** The status response payload. */
export type StatusResponse = z.infer<typeof statusResponseSchema>;

export { studioResponseSchema };
/** The studio response payload. */
export type StudioResponse = z.infer<typeof studioResponseSchema>;

export { translationResponseSchema };
/** The translation response payload. */
export type TranslationResponse = z.infer<
  typeof translationResponseSchema
>;

export { profileResponseSchema };
/** The profile response payload. */
export type ProfileResponse = z.infer<typeof profileResponseSchema>;

export { watchNowResponseSchema };
/** The watch now response payload. */
export type WatchNowResponse = z.infer<typeof watchNowResponseSchema>;

export { justWatchLinkResponseSchema };
/** The just watch link response payload. */
export type JustWatchLinkResponse = z.infer<typeof justWatchLinkResponseSchema>;

export { videoResponseSchema };
/** The video response payload. */
export type VideoResponse = z.infer<typeof videoResponseSchema>;

export { socialIdsResponseSchema };
/** The social ids response payload. */
export type SocialIdsResponse = z.infer<
  typeof socialIdsResponseSchema
>;
