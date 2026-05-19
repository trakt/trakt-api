import { authMetadata, builder } from '../_internal/builder.ts';
import { z } from '../_internal/z.ts';
import { codeRequestSchema } from './schema/request/codeRequestSchema.ts';
import {
  deviceTokenRequestSchema,
} from './schema/request/deviceTokenRequestSchema.ts';
import { tokenRefreshSchema } from './schema/request/tokenRefreshSchema.ts';
import { tokenRequestSchema } from './schema/request/tokenRequestSchema.ts';
import { codeResponseSchema } from './schema/response/codeResponseSchema.ts';
import { tokenResponseSchema } from './schema/response/tokenResponseSchema.ts';

const device = builder.router({
  code: {
    summary: 'Generate new device codes',
    description:
      `Generate new codes to start the device authentication process. The \`device_code\` and \`interval\` will be used later to poll for the \`access_token\`. The \`user_code\` and \`verification_url\` should be presented to the user as mentioned in the flow steps above.

#### QR Code

You might consider generating a QR code for the user to easily scan on their mobile device. The QR code should be a URL that redirects to the \`verification_url\` and appends the \`user_code\`. For example, \`https://trakt.tv/activate/5055CC52\` would load the Trakt hosted \`verification_url\` and pre-fill in the \`user_code\`.

#### JSON POST Data
| Key | Type | Value |
|---|---|---|
| \`client_id\` * | string | Get this from your app settings. |`,
    method: 'POST',
    path: '/code',
    body: codeRequestSchema,
    responses: {
      200: codeResponseSchema,
    },
  },
  token: {
    summary: 'Poll for the access_token',
    description:
      `Use the \`device_code\` and poll at the \`interval\` (in seconds) to check if the user has authorized you app. Use \`expires_in\` to stop polling after that many seconds, and gracefully instruct the user to restart the process. **It is important to poll at the correct interval and also stop polling when expired.**

When you receive a \`200\` success response, save the \`access_token\` so your app can authenticate the user in methods that require it. The \`access_token\` is valid for **7 days**. Save and use the \`refresh_token\` to get a new \`access_token\` without asking the user to re-authenticate. Check below for all the error codes that you should handle.

#### JSON POST Data
| Key | Type | Value |
|---|---|---|
| \`code\` * | string | \`device_code\` from the initial method. |
| \`client_id\` * | string | Get this from your app settings. |
| \`client_secret\` * | string | Get this from your app settings. |

#### Status Codes
This method will send various HTTP status codes that you should handle accordingly.

| Code | Description |
|---|---|
| \`200\` | Success - *save the \`access_token\`*
| \`400\` | Pending - *waiting for the user to authorize your app*
| \`404\` | Not Found - *invalid \`device_code\`*
| \`409\` | Already Used - *user already approved this code*
| \`410\` | Expired - *the tokens have expired, restart the process*
| \`418\` | Denied - *user explicitly denied this code*
| \`429\` | Slow Down - *your app is polling too quickly*`,
    path: '/token',
    method: 'POST',
    body: deviceTokenRequestSchema,
    responses: {
      200: tokenResponseSchema,
      400: z.undefined(),
    },
  },
}, {
  pathPrefix: '/device',
});

export { codeRequestSchema };
export type OAuthDeviceCodeRequest = z.infer<typeof codeRequestSchema>;

export { codeResponseSchema };
export type OAuthDeviceCodeResponse = z.infer<typeof codeResponseSchema>;

export { deviceTokenRequestSchema };
export type OAuthDeviceTokenRequest = z.infer<typeof deviceTokenRequestSchema>;

export { tokenRequestSchema };
export type OAuthTokenRequest = z.infer<typeof tokenRequestSchema>;

export { tokenRefreshSchema };
export type OAuthTokenRefresh = z.infer<typeof tokenRefreshSchema>;

export { tokenResponseSchema };
export type OAuthTokenResponse = z.infer<typeof tokenResponseSchema>;

export const oauth = builder
  .router({
    device,
    token: {
      summary: 'Exchange a token',
      description:
        'Exchange an OAuth authorization code or refresh token for an access token. Send the appropriate token request body; returns token details on success or a `400` response when the request cannot be processed.',
      path: '/token',
      method: 'POST',
      body: z.union([
        tokenRequestSchema,
        tokenRefreshSchema,
      ]),
      responses: {
        200: tokenResponseSchema,
        400: z.undefined(),
      },
    },
  }, {
    pathPrefix: '/oauth',
    metadata: authMetadata('none'),
  });
