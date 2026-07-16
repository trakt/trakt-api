import { authMetadata, builder } from '../_internal/builder.ts';
import { z } from '../_internal/z.ts';
import { movieCheckinRequestSchema } from './schema/request/movieCheckinRequestSchema.ts';
import { showCheckinRequestSchema } from './schema/request/showCheckinRequestSchema.ts';
import { checkin409ErrorResponse } from './schema/response/checkin409ErrorResponse.ts';
import { movieCheckinResponseSchema } from './schema/response/movieCheckinResponseSchema.ts';
import { showCheckinResponseSchema } from './schema/response/showCheckinResponseSchema.ts';

/** ts-rest contract for the `checkin` endpoints. */
export const checkin = builder.router({
  start: {
    summary: 'Check into an item',
    description: `#### 🔒 OAuth Required
Check into a movie or episode. This should be tied to a user action to manually indicate they are watching something. The item will display as *watching* on the site, then automatically switch to *watched* status once the duration has elapsed. A unique history \`id\` (64-bit integer) will be returned and can be used to reference this checkin directly.

#### JSON POST Data
| Key | Type | Value |
|---|---|---|
| item * | object | \`movie\` or \`episode\` object. (see examples ->) |
| \`sharing\`  | object | Control sharing to any connected social networks. (see below &#8595;) |
| \`message\`  | string | Message used for sharing. If not sent, it will use the watching string in the user settings. |

#### Sharing
The \`sharing\` object is optional and will apply the user's settings if not sent. If \`sharing\` is sent, each key will override the user's setting for that social network. Send \`true\` to post or \`false\` to not post on the indicated social network. You can see which social networks a user has connected with the [**/users/settings**](/reference/users/settings) method.

| Key | Type |
|---|---|
| \`twitter\` | boolean |
| \`mastodon\` | boolean |
| \`tumblr\` | boolean |

> ### Note
> _If a checkin is already in progress, a \`409\` HTTP status code will returned. The response will contain an \`expires_at\` timestamp which is when the user can check in again._`,
    method: 'POST',
    path: '',
    body: z.union([
      showCheckinRequestSchema,
      movieCheckinRequestSchema,
    ]),
    responses: {
      200: z.union([showCheckinResponseSchema, movieCheckinResponseSchema]),
      409: checkin409ErrorResponse,
    },
  },
  delete: {
    summary: 'Delete any active checkins',
    description: `#### 🔒 OAuth Required
Removes any active checkins, no need to provide a specific item.`,
    path: '',
    method: 'DELETE',
    responses: {
      204: z.undefined(),
    },
  },
}, {
  pathPrefix: '/checkin',
  metadata: authMetadata('required'),
});

export { showCheckinRequestSchema };
/** The show checkin request payload. */
export type ShowCheckinRequest = z.infer<typeof showCheckinRequestSchema>;

export { showCheckinResponseSchema };
/** The show checkin response payload. */
export type ShowCheckinResponse = z.infer<typeof showCheckinResponseSchema>;

export { movieCheckinRequestSchema };
/** The movie checkin request payload. */
export type MovieCheckinRequest = z.infer<typeof movieCheckinRequestSchema>;

export { movieCheckinResponseSchema };
/** The movie checkin response payload. */
export type MovieCheckinResponse = z.infer<typeof movieCheckinResponseSchema>;

export { checkin409ErrorResponse };
/** The checkin409 error response payload. */
export type Checkin409ErrorResponse = z.infer<typeof checkin409ErrorResponse>;
