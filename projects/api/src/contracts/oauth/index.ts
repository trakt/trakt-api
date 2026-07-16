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

const authorizeQuerySchema = z.object({
  response_type: z.string().optional(),
  client_id: z.string().optional(),
  redirect_uri: z.string().optional(),
  state: z.string().optional(),
});

const revokeRequestSchema = z.object({
  token: z.string(),
  client_id: z.string(),
  client_secret: z.string(),
});

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
/** The o auth device code request payload. */
export type OAuthDeviceCodeRequest = z.infer<typeof codeRequestSchema>;

export { codeResponseSchema };
/** The o auth device code response payload. */
export type OAuthDeviceCodeResponse = z.infer<typeof codeResponseSchema>;

export { deviceTokenRequestSchema };
/** The o auth device token request payload. */
export type OAuthDeviceTokenRequest = z.infer<typeof deviceTokenRequestSchema>;

export { tokenRequestSchema };
/** The o auth token request payload. */
export type OAuthTokenRequest = z.infer<typeof tokenRequestSchema>;

export { tokenRefreshSchema };
/** The o auth token refresh type. */
export type OAuthTokenRefresh = z.infer<typeof tokenRefreshSchema>;

export { tokenResponseSchema };
/** The o auth token response payload. */
export type OAuthTokenResponse = z.infer<typeof tokenResponseSchema>;

/** ts-rest contract for the `oauth` endpoints. */
export const oauth = builder
  .router({
    authorize: {
      summary: 'Authorize Application',
      description:
        `Construct then redirect to this URL. The Trakt website will request permissions for your app, which the user needs to approve. If the user isn't signed into Trakt, it will ask them to do so.

> ### Important
> _Use the website **https://trakt.tv** hostname when creating this URL and not the API URL._

#### Optional URL Parameters

When building the authorization URL, you can optionally include the following query parameters in the URL.

| Parameter | Value | Description |
|---|---|---|
| \`signup\` | \`true\` | Prefer the account sign up page to be the default. |
| \`prompt\` | \`login\` | Force the user to sign in and authorize your app. |`,
      path: '/authorize',
      method: 'GET',
      query: authorizeQuerySchema,
      responses: {
        200: z.undefined(),
      },
    },
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
    revoke: {
      summary: 'Revoke an access_token',
      description:
        `An \`access_token\` can be revoked when a user signs out of their Trakt account in your app. This is not required, but might improve the user experience so the user doesn't have an unused app connection hanging around.

#### JSON POST Data
| Key | Type | Value |
|---|---|---|
| \`token\` * | string | A valid OAuth \`access_token\`. |
| \`client_id\` * | string | Get this from your app settings. |
| \`client_secret\` * | string | Get this from your app settings. |`,
      path: '/revoke',
      method: 'POST',
      body: revokeRequestSchema,
      responses: {
        200: z.undefined(),
      },
    },
  }, {
    pathPrefix: '/oauth',
    metadata: authMetadata('none'),
  });
