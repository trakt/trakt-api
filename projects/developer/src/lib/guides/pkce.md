---
updatedAt: 2026-10-01T00:00:00.000Z
---

# 🔐 PKCE

PKCE (Proof Key for Code Exchange, pronounced "pixy") is the recommended way to
sign users in to your app. It adds a one-time secret to every sign-in, so an
authorization `code` is useless to anyone except the app that started the
request. Your app never needs a `client_secret`.

Use PKCE for every app that signs users in: websites, single-page apps, mobile
apps, desktop apps, and CLI tools that use the Authorization Code Flow.

> ### ⚠️ The Client Secret is deprecated for user sign-in
>
> A `client_secret` shipped inside a website, mobile app, or desktop app is not
> secret: anyone can extract it and impersonate your app. Only use it for
> server-to-server calls where it never leaves your backend. New integrations
> should use PKCE, and future apps may not receive a Client Secret at all.

## Why PKCE

Your `client_id` is public. It is visible in every authorization URL, so anyone
can copy it. Without PKCE, an attacker who copies your `client_id` and the
bundled `client_secret`, or intercepts a `code` on its way back to your app, can
exchange it for the user's tokens.

With PKCE, the token exchange also needs the `code_verifier` that only your app
knows. A stolen `client_id` or `code` cannot be turned into tokens, so copying
your app's credentials stops being useful.

## How It Works

1. **Create a code verifier.** Generate a random string of 43-128 characters
   from `A-Z`, `a-z`, `0-9`, and `-._~`. Keep it in memory or session storage
   for this sign-in only.
2. **Derive the code challenge.** Hash the verifier with SHA-256 and encode the
   result as base64url without padding. Trakt only supports the `S256` method.
3. **Redirect to authorize.** Send the user to
   `https://auth.trakt.tv/oauth/authorize` with the usual parameters plus
   `code_challenge` and `code_challenge_method=S256`.
4. **Receive the code.** Trakt redirects back to your `redirect_uri` with a
   `code`.
5. **Exchange the code.** Call
   [`POST /oauth/token`](/?section=reference&operation=postOauthToken) with the
   `code` and the original `code_verifier`. Do not send a `client_secret`.
   Trakt checks that the verifier matches the challenge from step 3.

## Redirect URIs

PKCE protects the `code`, but your app should still only receive it on an
address it truly owns. Use `https://` redirect URIs only.

- **Websites** use an `https://` callback on their own domain.
- **iOS apps** use
  [Universal Links](https://developer.apple.com/documentation/xcode/supporting-universal-links-in-your-app),
  so iOS opens the callback only in your app.
- **Android apps** use
  [verified App Links](https://developer.android.com/training/app-links/verify-android-applinks),
  so Android opens the callback only in your app.

Avoid custom schemes such as `myapp://callback`, `localhost` addresses, and the
`urn:ietf:wg:oauth:2.0:oob` out-of-band URI. Any app installed on the device can
register the same custom scheme or listen on the same local port and receive
your users' codes.

## Checklist

- Generate a new `code_verifier` for every sign-in and discard it afterwards.
- Always send `code_challenge_method=S256`.
- Never ship a `client_secret` in a website, mobile app, or desktop app.
- Register `https://` redirect URIs only, backed by Universal Links or verified
  App Links on mobile.
