---
updatedAt: 2026-10-07T00:00:00.000Z
---

# Rate Limits

Trakt uses Rate Limits to keep the API fast, stable, and available for everyone. These limits help prevent abuse, accidental request loops, and inefficient integrations while still allowing normal app usage.

When a request is rate limited, the API returns a `429 Too Many Requests` response. Check the response headers to understand which limit was reached and when your app can safely retry.

## Rate limit headers

Most API rate limit responses include `X-Ratelimit` and `Retry-After`.

In some cases, a `429` may be returned before the request reaches the API rate limiter, for example by security or abuse-prevention systems. These responses may omit both `X-Ratelimit` and `Retry-After`.

When `Retry-After` is present, wait at least the specified number of seconds before retrying.

| Header        | Description                                                                                                               | Value                                                                                                      |
| ------------- | ------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------- |
| `X-Ratelimit` | Optional debugging JSON object describing the rate limit bucket, window, total limit, remaining requests, and reset time. | `{"name":"UNAUTHED_API_GET_LIMIT","period":300,"limit":500,"remaining":0,"until":"2020-10-10T00:24:00Z"}` |
| `Retry-After` | Number of seconds to wait before retrying the request.                                                                    | `10`                                                                                                       |

## Current limits

There are separate limits for authenticated (user level) and unauthenticated (client ID + public IP) calls. We'll continue to adjust these limits to optimize API performance for everyone. The goal is to prevent API abuse and poor coding, but allow users to use apps normally.

| Name                     | Scope              | Verb                    | Methods | Limit                     |
| ------------------------ | ------------------ | ----------------------- | ------- | ------------------------- |
| `AUTHED_API_POST_LIMIT`  | Authenticated user | `POST`, `PUT`, `DELETE` | all     | 1 call per second         |
| `AUTHED_API_GET_LIMIT`   | Authenticated user | `GET`                   | all     | 500 calls every 5 minutes |
| `UNAUTHED_API_GET_LIMIT` | Client ID + public IP | `GET`                   | all     | 500 calls every 5 minutes |

Unauthenticated GET requests share a bucket when they use the same client ID and public IP. Different public IPs have separate buckets. Devices behind the same public IP share an allowance.

For GET endpoints where OAuth is optional, sending the signed-in user's valid access token is acceptable and uses the user's `AUTHED_API_GET_LIMIT` bucket. Without a token, the request uses `UNAUTHED_API_GET_LIMIT`. The bucket depends on whether the request is authenticated, even when the endpoint is public.

## Handling 429 responses

When your app receives a `429 Too Many Requests` response:

1. Check for `Retry-After` and pause requests for at least the specified number of seconds.
2. If `Retry-After` is missing, use exponential backoff with jitter and a limited number of retries.
3. Avoid immediately retrying the same request in a loop.
4. Use caching, pagination, and request de-duplication to reduce repeated calls.
5. Log the response status, `X-Ratelimit`, `Retry-After`, endpoint, request method, and whether the request was authenticated.

This information helps you debug rate limit issues and makes support requests easier to investigate.
