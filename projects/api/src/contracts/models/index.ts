import { commentResponseSchema } from '../_internal/response/commentResponseSchema.ts';
import { episodeResponseSchema } from '../_internal/response/episodeResponseSchema.ts';
import { episodeStatsResponseSchema } from '../_internal/response/episodeStatsResponseSchema.ts';
import { episodeTranslationResponseSchema } from '../_internal/response/episodeTranslationResponseSchema.ts';
import { jobResponseSchema } from '../_internal/response/jobResponseSchema.ts';
import { listAddResponseSchema } from '../_internal/response/listAddResponseSchema.ts';
import { listedMovieResponseSchema } from '../_internal/response/listedMovieResponseSchema.ts';
import { listedShowResponseSchema } from '../_internal/response/listedShowResponseSchema.ts';
import { listRemoveResponseSchema } from '../_internal/response/listRemoveResponseSchema.ts';
import { listResponseSchema } from '../_internal/response/listResponseSchema.ts';
import { peopleResponseSchema } from '../_internal/response/peopleResponseSchema.ts';
import { profileResponseSchema } from '../_internal/response/profileResponseSchema.ts';
import { ratingsResponseSchema } from '../_internal/response/ratingsResponseSchema.ts';
import { sentimentsResponseSchema } from '../_internal/response/sentimentsResponseSchema.ts';
import { statusResponseSchema } from '../_internal/response/statusResponseSchema.ts';
import { studioResponseSchema } from '../_internal/response/studioResponseSchema.ts';
import { translationResponseSchema } from '../_internal/response/translationResponseSchema.ts';
import { videoResponseSchema } from '../_internal/response/videoResponseSchema.ts';
import { watchNowResponseSchema } from '../_internal/response/watchNowResponseSchema.ts';
import type { z } from '../_internal/z.ts';

export { commentResponseSchema };
export type CommentResponse = z.infer<typeof commentResponseSchema>;

export { episodeResponseSchema };
export type EpisodeResponse = z.infer<typeof episodeResponseSchema>;

export { episodeStatsResponseSchema };
export type EpisodeStatsResponse = z.infer<typeof episodeStatsResponseSchema>;

export { episodeTranslationResponseSchema };
export type EpisodeTranslationResponse = z.infer<
  typeof episodeTranslationResponseSchema
>;

export { jobResponseSchema };
export type Job = z.infer<typeof jobResponseSchema>;

export type LikesResponse = z.infer<typeof episodeResponseSchema>;

export { listAddResponseSchema };
export type ListAddResponse = z.infer<typeof listAddResponseSchema>;

export { listedMovieResponseSchema };
export type ListedMovieResponse = z.infer<
  typeof listedMovieResponseSchema
>;

export { listedShowResponseSchema };
export type ListedShowResponse = z.infer<
  typeof listedShowResponseSchema
>;

export { listRemoveResponseSchema };
export type ListRemoveResponse = z.infer<
  typeof listRemoveResponseSchema
>;

export { listResponseSchema };
export type ListResponse = z.infer<typeof listResponseSchema>;

export { peopleResponseSchema };
export type PeopleResponse = z.infer<typeof peopleResponseSchema>;

export { ratingsResponseSchema };
export type RatingsResponse = z.infer<typeof ratingsResponseSchema>;

export { sentimentsResponseSchema };
export type SentimentsResponse = z.infer<typeof sentimentsResponseSchema>;

export { statusResponseSchema };
export type StatusResponse = z.infer<typeof statusResponseSchema>;

export { studioResponseSchema };
export type StudioResponse = z.infer<typeof studioResponseSchema>;

export { translationResponseSchema };
export type TranslationResponse = z.infer<
  typeof translationResponseSchema
>;

export { profileResponseSchema };
export type ProfileResponse = z.infer<typeof profileResponseSchema>;

export { watchNowResponseSchema };
export type WatchNowResponse = z.infer<typeof watchNowResponseSchema>;

export { videoResponseSchema };
export type VideoResponse = z.infer<typeof videoResponseSchema>;
