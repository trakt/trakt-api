import { z } from '../../../_internal/z.ts';

/** Zod schema for plex library selection. */
export const plexLibrarySelectionSchema = z.object({
  server_id: z.string(),
  uuid: z.string(),
});

/** Zod schema for sync movie toggles. */
export const syncMovieTogglesSchema = z.object({
  watching: z.boolean(),
  watched: z.boolean(),
  rated: z.boolean(),
  collected: z.boolean(),
  watchlist: z.boolean(),
});

/** Zod schema for sync show toggles. */
export const syncShowTogglesSchema = z.object({
  rated: z.boolean(),
  watchlist: z.boolean(),
});

/** Zod schema for sync season toggles. */
export const syncSeasonTogglesSchema = z.object({
  rated: z.boolean(),
});

/** Zod schema for sync episode toggles. */
export const syncEpisodeTogglesSchema = z.object({
  watching: z.boolean(),
  watched: z.boolean(),
  rated: z.boolean(),
  collected: z.boolean(),
});

/** Zod schema for scrobbler movie toggles. */
export const scrobblerMovieTogglesSchema = z.object({
  watching: z.boolean(),
  watched: z.boolean(),
  rated: z.boolean(),
  collected: z.boolean(),
});

/** Zod schema for scrobbler show toggles. */
export const scrobblerShowTogglesSchema = z.object({
  rated: z.boolean(),
});

/** Zod schema for scrobbler season toggles. */
export const scrobblerSeasonTogglesSchema = z.object({
  rated: z.boolean(),
});

/** Zod schema for scrobbler episode toggles. */
export const scrobblerEpisodeTogglesSchema = z.object({
  watching: z.boolean(),
  watched: z.boolean(),
  rated: z.boolean(),
  collected: z.boolean(),
});

/** Zod schema for plex sync toggles. */
export const plexSyncTogglesSchema = z.object({
  movie: syncMovieTogglesSchema,
  show: syncShowTogglesSchema,
  season: syncSeasonTogglesSchema,
  episode: syncEpisodeTogglesSchema,
});

/** Zod schema for plex scrobbler toggles. */
export const plexScrobblerTogglesSchema = z.object({
  movie: scrobblerMovieTogglesSchema,
  show: scrobblerShowTogglesSchema,
  season: scrobblerSeasonTogglesSchema,
  episode: scrobblerEpisodeTogglesSchema,
});

/** Zod schema for the plex settings response. */
export const plexSettingsResponseSchema = z.object({
  connection: z.object({
    connected: z.boolean().openapi({
      description: 'Whether a Plex authorization exists.',
    }),
    username: z.string().nullable().openapi({
      description: 'The stored Plex uid (currently usually null).',
    }),
  }),
  webhook: z.object({
    url: z.string().nullable().openapi({
      description:
        'The real-time scrobbler webhook URL; null unless the user is VIP.',
    }),
    last_event_at: z.string().datetime().nullable().openapi({
      description:
        'When the webhook last fired, normalized to `.000Z`, or null.',
    }),
    event_count: z.number().int(),
    home_users: z.string().nullable().openapi({
      description: 'Comma-separated Plex home usernames to scrobble for.',
    }),
  }),
  sync: z.object({
    configured: z.boolean().openapi({
      description: 'Whether the initial sync has been set up.',
    }),
    error: z.boolean().openapi({
      description: 'Whether a persisted Plex-sync error is currently active.',
    }),
    selection: z.object({
      server_ids: z.string().array(),
      library_ids: plexLibrarySelectionSchema.array(),
      user_ids: z.string().array(),
    }),
    toggles: plexSyncTogglesSchema.openapi({
      description:
        'Batch-sync toggles (unset ⇒ false). Includes `watching`/`watchlist`.',
    }),
  }),
  scrobbler: z.object({
    toggles: plexScrobblerTogglesSchema.openapi({
      description:
        'Real-time scrobbler toggles (unset ⇒ false). No `watchlist`.',
    }),
  }),
});
