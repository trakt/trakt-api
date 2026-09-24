---
updatedAt: 2026-09-24T00:00:00.000Z
---

# User Account Limits

Read account limits from [**GET /users/settings**](/?section=reference&operation=getUsersSettings) instead of hardcoding them. Limits can vary by account and change over time, including for VIP users.

## Read and display limits

The settings response includes `user.vip` and a `limits` object. Here are a few examples of the returned limits:

| Field | Maximum |
| ----- | ------- |
| `limits.list.count` | Personal lists. |
| `limits.list.item_count` | Items per personal list. |
| `limits.watchlist.item_count` | Watchlist items. |

Fetch these after sign-in and use them to display account allowances and adapt add or create actions.

## Handle `420` responses

`420` means **Account Limit Exceeded**. The response can have an empty body and no limit headers.

1. Fetch `/users/settings`.
2. Show the relevant limit, or open a dedicated Trakt account limits view.
3. Offer a way forward, such as removing items or choosing another list.

Retry once there's capacity; automatic retries won't resolve an account limit.
