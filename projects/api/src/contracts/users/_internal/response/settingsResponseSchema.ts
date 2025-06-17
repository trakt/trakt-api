import { z } from 'zod';
import { genreEnumSchema } from '../../../_internal/response/genreEnumSchema.ts';
import { sortDirectionSchema } from '../../../_internal/response/sortDirectionSchema.ts';
import { upNextSortBySchema } from '../../../_internal/response/upNextSortBySchema.ts';
import { watchActionSchema } from './watchActionSchema.ts';

export const settingsResponseSchema = z.object({
  user: z.object({
    username: z.string(),
    private: z.boolean(),
    name: z.string().nullish(),
    vip: z.boolean(),
    vip_ep: z.boolean(),
    director: z.boolean(),
    ids: z.object({
      slug: z.string(),
      trakt: z.number().int().nullish(),
      uuid: z.string(),
    }),
    joined_at: z.string().datetime(),
    location: z.string().nullish(),
    about: z.string().nullish(),
    gender: z.string().nullish(),
    age: z.number().int().nullish(),
    images: z.object({ avatar: z.object({ full: z.string() }) }),
    vip_og: z.boolean(),
    vip_years: z.number().int(),
    vip_cover_image: z.string().nullish(),
    dob: z.string().nullish(),
  }),
  permissions: z.object({
    commenting: z.boolean(),
    liking: z.boolean(),
    following: z.boolean(),
  }),
  /***
   * Available if requesting extended `browsing`.
   */
  browsing: z.object({
    watch_popup_action: watchActionSchema,
    hide_watching_now: z.boolean(),
    list_popup_action: z.string(),
    week_start_day: z.string().nullish(),
    watch_after_rating: z.string().nullish(),
    watch_only_once: z.boolean(),
    other_site_ratings: z.boolean(),
    release_date_ignore_runtime: z.boolean(),
    display_early_ratings: z.boolean(),
    hide_episode_type_tags: z.boolean(),
    hide_unsaved_filters_prompt: z.boolean(),
    spoilers: z.object({
      episodes: z.string().nullish(),
      shows: z.string().nullish(),
      movies: z.string().nullish(),
      comments: z.string().nullish(),
      ratings: z.string().nullish(),
      actors: z.string().nullish(),
    }),
    calendar: z.object({
      period: z.string().nullish(),
      start_day: z.string().nullish(),
      layout: z.string().nullish(),
      image_type: z.string().nullish(),
      hide_specials: z.boolean(),
      autoscroll: z.boolean(),
    }),
    progress: z.object({
      on_deck: z.object({
        sort: upNextSortBySchema.nullish(),
        sort_how: sortDirectionSchema,
        refresh: z.boolean(),
        simple_progress: z.boolean(),
        only_favorites: z.boolean(),
      }),
      watched: z.object({
        refresh: z.boolean(),
        simple_progress: z.boolean(),
        include_specials: z.boolean(),
        include_watchlisted: z.boolean(),
        include_collected: z.boolean(),
        sort: z.string().nullish(),
        sort_how: sortDirectionSchema,
        use_last_activity: z.boolean(),
        grid_view: z.boolean(),
      }),
      collected: z.object({
        refresh: z.boolean(),
        simple_progress: z.boolean(),
        include_specials: z.boolean(),
        include_watchlisted: z.boolean(),
        include_watched: z.boolean(),
        sort: z.string().nullish(),
        sort_how: sortDirectionSchema,
        use_last_activity: z.boolean(),
        grid_view: z.boolean(),
      }).nullish(),
    }),
    watchnow: z.object({
      country: z.string().nullish(),
      favorites: z.array(z.string()),
      only_favorites: z.boolean(),
    }),
    dark_knight: z.string(),
    app_theme: z.string(),
    welcome: z.object({
      completed_at: z.string().datetime(),
      exit_step: z.null(),
    }),
    genres: z.object({
      favorites: z.array(genreEnumSchema).nullish(),
      disliked: z.array(genreEnumSchema).nullish(),
    }),
    comments: z.object({ blocked_uids: z.array(z.unknown()) }),
    recommendations: z.object({
      ignore_collected: z.boolean(),
      ignore_watchlisted: z.boolean(),
    }),
    rewatching: z.object({ adjust_percentage: z.boolean() }),
    profile: z.object({
      favorites: z.object({
        sort_by: z.string(),
        sort_how: sortDirectionSchema,
      }),
      most_watched_shows: z.object({ sort_by: z.string(), tab: z.string() }),
      most_watched_movies: z.object({ sort_by: z.string(), tab: z.string() }),
    }),
    search: z.object({
      image_type: z.string().nullish(),
      recent_queries: z.array(
        z.object({
          query: z.string(),
          type: z.string(),
          created_at: z.number().int(),
        }),
      ),
    }).nullish(),
  }).nullish(),
  account: z.object({
    timezone: z.string(),
    date_format: z.string(),
    time_24hr: z.boolean(),
    cover_image: z.string().nullish(),
    token: z.string().nullish(),
    display_ads: z.boolean().nullish(),
  }),
  connections: z.object({
    facebook: z.boolean(),
    twitter: z.boolean(),
    mastodon: z.boolean(),
    google: z.boolean(),
    tumblr: z.boolean(),
    medium: z.boolean(),
    slack: z.boolean(),
    apple: z.boolean(),
    dropbox: z.boolean(),
    microsoft: z.boolean(),
  }).nullish(),
  sharing_text: z.object({
    watching: z.string(),
    watched: z.string(),
    rated: z.string().nullish(),
  }).nullish(),
  limits: z.object({
    list: z.object({ count: z.number().int(), item_count: z.number().int() }),
    watchlist: z.object({ item_count: z.number().int() }),
    favorites: z.object({ item_count: z.number().int() }),
  }).nullish(),
});
