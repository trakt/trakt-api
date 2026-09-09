---
updatedAt: 2026-09-09T02:34:16.068Z
---

# Authentication

The Trakt API uses OAuth 2.0 for user authentication. Some endpoints are
"public" and only require your API key, while others require an authenticated
user access token. A few endpoints can also return more personalized results
when OAuth is provided, even if authentication is optional.

Every app should send the required Trakt API headers, including your
`trakt-api-key`. For endpoints that require or support OAuth, also send the user
access token as a Bearer token: `Authorization: Bearer <access_token>`

Trakt supports two OAuth flows:

1. **Authorization Code Flow** - Best for apps that can open a browser and
   receive a redirect callback.
2. **Device Code Flow** - Best for TVs, media centers, CLI tools, and other
   devices with limited input.

Check each endpoint’s documentation to see whether OAuth is required, optional,
or not needed.

## Register Your Application

To obtain a `client_id` and `client_secret`, create an application on the Trakt
website.

- [Create a new API app](https://app.trakt.tv/settings/apps/api/new)
- [View your API apps](https://app.trakt.tv/settings/apps/api)

## Authorization Code Flow

For mobile apps, desktop apps, and websites with access to a web browser.

### Application Flow

1. **Redirect to request Trakt access.** Using the `/oauth/authorize` method,
   construct then redirect to this URL. The Trakt website will request
   permissions for your app and the user will have the opportunity to sign up
   for a new Trakt account or sign in with their existing account.
2. **Trakt redirects back to your site.** If the user accepts your request,
   Trakt redirects back to your site with a temporary code in a `code` GET
   parameter as well as the state (if provided) in the previous step in a
   `state` parameter. If the states don’t match, the request has been created by
   a third party and the process should be aborted. The `redirect_uri` is
   case-sensitive and must exactly match the URI configured in your Trakt
   application. Use the identical value in the authorization request and token
   exchange.
3. **Exchange the code for an access token.** If everything looks good in step
   2, exchange the `code` for an access token using the
   [/oauth/token](/?section=reference&operation=postOauthToken) method. Save
   the `access_token` so your app can authenticate the user by sending the
   `Authorization` header as described above. The `access_token` is valid for
   **7 days**. Save and use the `refresh_token` to get a new `access_token`
   without asking the user to re-authenticate.

## Device Code Flow

Device authentication is for apps and services with limited input or display
capabilities. This includes media center plugins, smart watches, smart TVs,
command line scripts, and system services.

Your app displays an alphanumeric code (typically 8 characters) to the user.
They are then instructed to visit the verification URL on their computer or
mobile device. After entering the code, the user will be prompted to grant
permission for your app. After your app gets permissions, the device receives an
`access_token` and works like standard OAuth from that point on. More details
below.

### Device Flow

1. **Generate codes.** Your app calls
   [/oauth/device/code](/?section=reference&operation=postOauthDeviceCode) to
   generate new codes. Save this entire response for later use.
2. **Display the code.** Display the `user_code` and instruct the user to visit
   the `verification_url` on their computer or mobile device.
3. **Poll for authorization.** Poll the
   [/oauth/device/token](/?section=reference&operation=postOauthDeviceToken)
   method to see if the user successfully authorizes your app. Use the
   `device_code` and poll at the `interval` (in seconds) to check if the user
   has authorized your app. See the
   [device token endpoint documentation](/?section=reference&operation=postOauthDeviceToken)
   for the specific error codes you need to handle. Use `expires_in` to stop
   polling after that many seconds, and gracefully instruct the user to restart
   the process. **It is important to poll at the correct interval and also stop
   polling when expired.**
4. **Successful authorization.** When you receive a `200` success response, save
   the `access_token` so your app can authenticate the user in methods that
   require it. The `access_token` is valid for **7 days**. Save and use the
   `refresh_token` to get a new `access_token` without asking the user to
   re-authenticate. It's normal OAuth from this point.

### User Flow

1. **Call to action.** Consider your user experience when asking a user to
   connect their Trakt account. For some devices this will be right away, and
   for others it might be later in the experience.
2. **Display the code.** When a user clicks the call to action, your app calls
   [/oauth/device/code](/?section=reference&operation=postOauthDeviceCode) to
   generate new codes. In your UI, display the `user_code` and instruct the user
   to visit the `verification_url` on their computer or mobile device. The
   `user_code` is typically 8 characters, so make sure there is enough room to
   display the full code.
3. **Authorizing your app.** When the user visits the `verification_url` it
   first checks to make sure they're signed in. If not signed in, they'll be
   able to sign in or sign up for a new account. After entering the code, the
   user will be prompted to grant permission for your app. Once approved, the
   user will see a success message indicating their device is connected.
4. **Confirm successful authorization.** Your app will be polling to see if the
   user successfully authorizes your app. Once they have, refresh your UI to
   indicate a successful connection has been made.

## Refreshing an Access Token

Access tokens are valid for 7 days. Use the `refresh_token` returned during
authorization with the
[`POST /oauth/token`](/?section=reference&operation=postOauthToken) endpoint
to obtain a new access token without asking the user to authorize your app
again.

⚠️ Refresh tokens are **single-use**. Every successful refresh returns a new
`access_token` and `refresh_token`. The refresh token used in the request is
immediately invalidated, so always replace your stored tokens with the values
from the response.

If the token exchange cannot be completed, the API returns a `400` response with
an OAuth error body:

```json
{
  "error": "invalid_grant",
  "error_description": "session not found"
}
```

Make sure your HTTP client preserves response bodies for non-successful requests
so this information is not discarded.

> ### 🗒️ Legacy Refresh Tokens
>
> Refresh tokens issued before the recent authentication migration can no longer
> be exchanged. If an affected user receives `invalid_grant` with
> `session not found`, ask them to authorize the application again once. Tokens
> issued afterward refresh normally.
