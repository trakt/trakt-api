---
updatedAt: 2026-07-17T07:57:30.000Z
---

# VIP Methods

Some API methods are tagged 🔥 **VIP Only**. A `426` HTTP status code is returned when the user isn't a VIP, indicating they need to sign up for [**Trakt VIP**](https://app.trakt.tv/vip) in order to use this method. In your app, please open a browser to `X-Upgrade-URL` so the user can sign up for Trakt VIP.

| Header          | Value                  |
| --------------- | ---------------------- |
| `X-Upgrade-URL` | `https://trakt.tv/vip` |

Some API methods are tagged 🔥 **VIP Enhanced**. A `420` HTTP status code is returned when the user has exceeded their account limit. Signing up for [**Trakt VIP**](https://app.trakt.tv/vip) will increase these limits. If the user isn't a VIP, please open a browser to `X-Upgrade-URL` so the user can sign up for Trakt VIP. If they are already VIP and still exceeded the limit, please display a message indicating this.

| Header            | Value                  |
| ----------------- | ---------------------- |
| `X-Upgrade-URL`   | `https://trakt.tv/vip` |
| `X-VIP-User`      | `true` or `false`      |
| `X-Account-Limit` | Limit allowed.         |
