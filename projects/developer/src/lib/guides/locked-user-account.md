---
updatedAt: 2025-05-22T12:28:25.000Z
---

# Locked User Account

A `423` HTTP status code is returned when the OAuth user has a locked or deactivated user account. Please instruct the user to [**email Trakt support**](mailto:support@trakt.tv) so we can fix their account. API access will be suspended for the user until we fix their account.

| Header                  | Value             |
| ----------------------- | ----------------- |
| `X-Account-Locked`      | `true` or `false` |
| `X-Account-Deactivated` | `true` or `false` |
