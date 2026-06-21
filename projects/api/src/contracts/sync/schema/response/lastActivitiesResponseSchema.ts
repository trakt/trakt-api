import { z } from '../../../_internal/z.ts';

const timestampSchema = z.string().datetime();

const movieActivitiesSchema = z.object({
  watched_at: timestampSchema,
  collected_at: timestampSchema,
  rated_at: timestampSchema,
  watchlisted_at: timestampSchema,
  favorited_at: timestampSchema,
  commented_at: timestampSchema,
  paused_at: timestampSchema,
  hidden_at: timestampSchema,
});

const episodeActivitiesSchema = z.object({
  watched_at: timestampSchema,
  collected_at: timestampSchema,
  rated_at: timestampSchema,
  watchlisted_at: timestampSchema,
  commented_at: timestampSchema,
  paused_at: timestampSchema,
});

const showActivitiesSchema = z.object({
  rated_at: timestampSchema,
  watchlisted_at: timestampSchema,
  favorited_at: timestampSchema,
  commented_at: timestampSchema,
  hidden_at: timestampSchema,
  dropped_at: timestampSchema,
});

const seasonActivitiesSchema = z.object({
  rated_at: timestampSchema,
  watchlisted_at: timestampSchema,
  commented_at: timestampSchema,
  hidden_at: timestampSchema,
});

const commentActivitiesSchema = z.object({
  liked_at: timestampSchema,
  reacted_at: timestampSchema,
  blocked_at: timestampSchema,
});

const listActivitiesSchema = z.object({
  liked_at: timestampSchema,
  reacted_at: timestampSchema,
  updated_at: timestampSchema,
  commented_at: timestampSchema,
});

const updatedActivitiesSchema = z.object({
  updated_at: timestampSchema,
});

const accountActivitiesSchema = z.object({
  settings_at: timestampSchema,
  followed_at: timestampSchema,
  following_at: timestampSchema,
  pending_at: timestampSchema,
  requested_at: timestampSchema,
});

export const lastActivitiesResponseSchema = z.object({
  all: timestampSchema,
  movies: movieActivitiesSchema,
  episodes: episodeActivitiesSchema,
  shows: showActivitiesSchema,
  seasons: seasonActivitiesSchema,
  comments: commentActivitiesSchema,
  lists: listActivitiesSchema,
  watchlist: updatedActivitiesSchema,
  favorites: updatedActivitiesSchema,
  collaborations: updatedActivitiesSchema,
  account: accountActivitiesSchema,
  saved_filters: updatedActivitiesSchema,
  notes: updatedActivitiesSchema,
});
