---
updatedAt: 2026-11-27T00:00:00.000Z
---

# API URL

> ### 🔐 Sign-in uses auth.trakt.tv
>
> Every OAuth route goes to `https://auth.trakt.tv`. Every other API call stays
> on the API host below.

The API should always be accessed over SSL.

```
https://api.trakt.tv
```

[Premium](/docs/premium) apps use the Premium host instead. Paths and headers are the same; Standard apps calling it are rejected.

```
https://apiz.trakt.tv
```

## Authentication URL

[OAuth](/docs/authentication-oauth) routes use the auth host.

```
https://auth.trakt.tv
```

| Route                     | URL                                             |
| ------------------------- | ----------------------------------------------- |
| Authorize                 | `https://auth.trakt.tv/oauth/authorize`         |
| Token and refresh         | `POST https://auth.trakt.tv/oauth/token`        |
| Revoke                    | `POST https://auth.trakt.tv/oauth/revoke`       |
| Device code               | `POST https://auth.trakt.tv/oauth/device/code`  |
| Device token              | `POST https://auth.trakt.tv/oauth/device/token` |
| Activate (device sign-in) | `https://auth.trakt.tv/activate`                |

For the activate page, show users the `verification_url` from the device code
response instead of hardcoding it.
