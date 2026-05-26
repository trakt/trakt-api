import { authMetadata, builder } from '../_internal/builder.ts';
import { z } from '../_internal/z.ts';
import { episodeScrobbleRequestSchema } from './schema/request/episodeScrobbleRequestSchema.ts';
import { movieScrobbleRequestSchema } from './schema/request/movieScrobbleRequestSchema.ts';
import { episodeScrobbleResponseSchema } from './schema/response/episodeScrobbleResponseSchema.ts';
import { movieScrobbleResponseSchema } from './schema/response/movieScrobbleResponseSchema.ts';

export const scrobble = builder.router({
  start: {
    summary: 'Start watching in a media center',
    description: `#### 🔒 OAuth Required
Use this method when the video initially starts playing or is unpaused. This will remove any playback progress if it exists.

> ### Note
> _A watching status will auto expire after the remaining runtime has elapsed. There is no need to call this method again while continuing to watch the same item._

#### JSON POST Data
| Key | Type | Value |
|---|---|---|
| item * | object | \`movie\` or \`episode\` object. (see examples ->) |
| \`progress\` * | float | Progress percentage between 0 and 100. |`,
    path: '/start',
    method: 'POST',
    body: z.union([movieScrobbleRequestSchema, episodeScrobbleRequestSchema]),
    responses: {
      201: z.union([
        movieScrobbleResponseSchema,
        episodeScrobbleResponseSchema,
      ]),
    },
  },
  pause: {
    summary: 'Pause watching in a media center',
    description: `#### 🔒 OAuth Required
Pause an active scrobble for a movie or episode. Send the media object and current progress in the request body; the response returns the updated scrobble state.`,
    path: '/pause',
    method: 'POST',
    body: z.union([movieScrobbleRequestSchema, episodeScrobbleRequestSchema]),
    responses: {
      201: z.union([
        movieScrobbleResponseSchema,
        episodeScrobbleResponseSchema,
      ]),
    },
  },
  stop: {
    summary: 'Stop or finish watching in a media center',
    description: `#### 🔒 OAuth Required
Use this method when the video is stopped or finishes playing on its own. If the progress is above 80%, the video will be scrobbled and the \`action\` will be set to **scrobble**. A unique history \`id\` (64-bit integer) will be returned and can be used to reference this \`scrobble\` directly.

If the progress is between 1% and 79%, it will be treated as a *pause* and the \`action\` will be set to **pause**. The playback progress will be saved and [**/sync/playback**](/reference/sync/playback/) can be used to resume the video from this exact position.

> ### Note
> _If the progress is less than 1%, you'll get a \`422\` HTTP status code response and the scrobble will be ignored._

#### JSON POST Data
| Key | Type | Value |
|---|---|---|
| item * | object | \`movie\` or \`episode\` object. (see examples ->) |
| \`progress\` * | flloat | Progress percentage between 0 and 100. |

> ### Note
> _If the same item was just scrobbled, a \`409\` HTTP status code will returned to avoid scrobbling a duplicate. The response will contain a \`watched_at\` timestamp when the item was last scrobbled and a \`expires_at\` timestamp when the item can be scrobbled again._`,
    path: '/stop',
    method: 'POST',
    body: z.union([movieScrobbleRequestSchema, episodeScrobbleRequestSchema]),
    responses: {
      201: z.union([
        movieScrobbleResponseSchema,
        episodeScrobbleResponseSchema,
      ]),
    },
  },
}, {
  pathPrefix: '/scrobble',
  metadata: authMetadata('required'),
});

export {
  episodeScrobbleRequestSchema,
  episodeScrobbleResponseSchema,
  movieScrobbleRequestSchema,
  movieScrobbleResponseSchema,
};

export type MovieScrobbleRequest = z.infer<typeof movieScrobbleRequestSchema>;
export type MovieScrobbleResponse = z.infer<typeof movieScrobbleResponseSchema>;
export type EpisodeScrobbleRequest = z.infer<
  typeof episodeScrobbleRequestSchema
>;
export type EpisodeScrobbleResponse = z.infer<
  typeof episodeScrobbleResponseSchema
>;
