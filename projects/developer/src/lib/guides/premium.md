---
updatedAt: 2026-10-13T00:00:00.000Z
---

# Premium

Every developer account starts on the **Standard** tier. **Premium** is a paid plan for developers whose apps need more headroom: higher rate limits, access to more of the API, and no community app limit.

Premium applies to your developer account, so every app you own gets it at once. Compare the tiers and subscribe on the [Premium page](/premium).

## What Premium changes

| | Standard | Premium |
| --- | --- | --- |
| API host | `api.trakt.tv` | `apiz.trakt.tv` |
| Rate limits | Standard | Higher |
| Endpoint access | Public endpoints | Public and [Limited Access](/docs/limted-access) endpoints |
| Community app limit | Counts toward it | Exempt |

Exact rate limit values can change over time. Read them from the `X-Ratelimit` header when it is present rather than hardcoding them, and handle responses that omit it. See [Rate Limits](/docs/rate-limiting).

## Use the Premium host

Premium apps call `apiz.trakt.tv` instead of `api.trakt.tv`. Paths, [required headers](/docs/required-headers), and [authentication](/docs/authentication-oauth) are identical, so switching is a base URL change.

```
https://apiz.trakt.tv
```

Requests from a Standard app to `apiz.trakt.tv` are rejected. Keep Standard apps on `api.trakt.tv`.

## Billing

Premium is a single monthly plan. Checkout and invoices are handled by Stripe, the same processor behind Trakt VIP. You can cancel at any time; Premium stays active until the end of the paid month, after which your apps return to the Standard tier and must call `api.trakt.tv` again.

Premium is separate from [Trakt VIP](/docs/vip-methods). VIP is a plan for Trakt users and their accounts. Premium is a plan for developers and the apps they build.
