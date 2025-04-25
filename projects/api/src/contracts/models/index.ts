import type { commentResponseSchema } from '../_internal/response/commentResponseSchema.ts';
import type { episodeResponseSchema } from '../_internal/response/episodeResponseSchema.ts';
import type { episodeStatsResponseSchema } from '../_internal/response/episodeStatsResponseSchema.ts';
import type { episodeTranslationResponseSchema } from '../_internal/response/episodeTranslationResponseSchema.ts';
import type { jobResponseSchema } from '../_internal/response/jobResponseSchema.ts';
import type { listAddResponseSchema } from '../_internal/response/listAddResponseSchema.ts';
import type { listedMovieResponseSchema } from '../_internal/response/listedMovieResponseSchema.ts';
import type { listedShowResponseSchema } from '../_internal/response/listedShowResponseSchema.ts';
import type { listRemoveResponseSchema } from '../_internal/response/listRemoveResponseSchema.ts';
import type { listResponseSchema } from '../_internal/response/listResponseSchema.ts';
import type { peopleResponseSchema } from '../_internal/response/peopleResponseSchema.ts';
import type { profileResponseSchema } from '../_internal/response/profileResponseSchema.ts';
import type { ratingsResponseSchema } from '../_internal/response/ratingsResponseSchema.ts';
import type { sentimentsResponseSchema } from '../_internal/response/sentimentsResponseSchema.ts';
import type { statusResponseSchema } from '../_internal/response/statusResponseSchema.ts';
import type { studioResponseSchema } from '../_internal/response/studioResponseSchema.ts';
import type { translationResponseSchema } from '../_internal/response/translationResponseSchema.ts';
import type { videoResponseSchema } from '../_internal/response/videoResponseSchema.ts';
import type { watchNowResponseSchema } from '../_internal/response/watchNowResponseSchema.ts';
import type { z } from '../_internal/z.ts';

export type CommentResponse = z.infer<typeof commentResponseSchema>;
export type EpisodeResponse = z.infer<typeof episodeResponseSchema>;
export type EpisodeStatsResponse = z.infer<typeof episodeStatsResponseSchema>;
export type EpisodeTranslationResponse = z.infer<
  typeof episodeTranslationResponseSchema
>;
export type Job = z.infer<typeof jobResponseSchema>;
export type LikesResponse = z.infer<typeof episodeResponseSchema>;
export type ListAddResponse = z.infer<typeof listAddResponseSchema>;
export type ListedMovieResponse = z.infer<
  typeof listedMovieResponseSchema
>;
export type ListedShowResponse = z.infer<
  typeof listedShowResponseSchema
>;
export type ListRemoveResponse = z.infer<
  typeof listRemoveResponseSchema
>;
export type ListResponse = z.infer<typeof listResponseSchema>;
export type PeopleResponse = z.infer<typeof peopleResponseSchema>;
export type RatingsResponse = z.infer<typeof ratingsResponseSchema>;
export type SentimentsResponse = z.infer<typeof sentimentsResponseSchema>;
export type StatusResponse = z.infer<typeof statusResponseSchema>;
export type StudioResponse = z.infer<typeof studioResponseSchema>;
export type TranslationResponse = z.infer<
  typeof translationResponseSchema
>;
export type ProfileResponse = z.infer<typeof profileResponseSchema>;
export type WatchNowResponse = z.infer<typeof watchNowResponseSchema>;
export type VideoResponse = z.infer<typeof videoResponseSchema>;
