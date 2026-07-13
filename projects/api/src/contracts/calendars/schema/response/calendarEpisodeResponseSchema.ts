import { episodeResponseSchema } from '../../../_internal/response/episodeResponseSchema.ts';
import { z } from '../../../_internal/z.ts';

/**
 * Episode as returned by the calendar endpoints. Extends the shared episode
 * with the day-grouping fields that `?group=day` populates: `episode_type` can
 * additionally be a computed card type, and `episodes` holds the collapsed
 * group. Both are nullish, so a single shape covers the raw and grouped feeds
 * without touching the shared `episodeResponseSchema`.
 */
export const calendarEpisodeResponseSchema = episodeResponseSchema.extend({
  episode_type: z
    .enum([
      'standard',
      'series_premiere',
      'season_premiere',
      'mid_season_finale',
      'mid_season_premiere',
      'season_finale',
      'series_finale',
      'full_season',
      'multiple_episodes',
    ])
    .nullish(),
  episodes: episodeResponseSchema.array().nullish(),
});
