import { z } from '../../../_internal/z.ts';
import {
  plexLibrarySelectionSchema,
  scrobblerEpisodeTogglesSchema,
  scrobblerMovieTogglesSchema,
  scrobblerSeasonTogglesSchema,
  scrobblerShowTogglesSchema,
  syncEpisodeTogglesSchema,
  syncMovieTogglesSchema,
  syncSeasonTogglesSchema,
  syncShowTogglesSchema,
} from '../response/plexSettingsResponseSchema.ts';

// Mirrors the GET shape so it round-trips. Every key is optional and omitted
// toggle keys are left unchanged server-side (no clobbering), so each toggle
// group is a partial of its response counterpart.
/** Zod schema for plex settings update. */
export const plexSettingsUpdateSchema = z.object({
  sync: z.object({
    selection: z.object({
      server_ids: z.string().array().optional(),
      library_ids: plexLibrarySelectionSchema.array().optional(),
      user_ids: z.string().array().optional(),
    }).optional(),
    toggles: z.object({
      movie: syncMovieTogglesSchema.partial().optional(),
      show: syncShowTogglesSchema.partial().optional(),
      season: syncSeasonTogglesSchema.partial().optional(),
      episode: syncEpisodeTogglesSchema.partial().optional(),
    }).optional(),
  }).optional(),
  scrobbler: z.object({
    toggles: z.object({
      movie: scrobblerMovieTogglesSchema.partial().optional(),
      show: scrobblerShowTogglesSchema.partial().optional(),
      season: scrobblerSeasonTogglesSchema.partial().optional(),
      episode: scrobblerEpisodeTogglesSchema.partial().optional(),
    }).optional(),
  }).optional(),
  webhook: z.object({
    home_users: z.string().nullable().openapi({
      description: 'Comma-separated Plex home usernames to scrobble for.',
    }),
  }).partial().optional(),
  trigger_sync: z.object({
    watched_all_data: z.boolean(),
    collection_all_data: z.boolean(),
    ratings_all_data: z.boolean(),
    watchlist_all_data: z.boolean(),
  }).partial().optional().openapi({
    description:
      'Optional. Only this block touches sync timestamps/enqueues work: any `*_all_data: true` resets the affected cursors and enqueues a full sync per selected server; present-but-all-false seeds every cursor to "now" (first sync skips old history); absent writes settings without syncing.',
  }),
});
