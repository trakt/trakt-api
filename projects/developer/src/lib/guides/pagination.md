---
updatedAt: 2026-09-04T07:20:30.000Z
---

# Pagination

Some API endpoints return paginated results. Use the `page` and `limit` query parameters to control which results are returned:

`?page={page}&limit={limit}`

We recommend always sending pagination parameters when an endpoint supports them rather than relying on its default behavior.

## Defaults and limits

Pagination defaults and maximum page sizes can vary by endpoint and response type.

When pagination parameters are omitted, the API applies an endpoint-specific default. This is often a relatively small first page — for example, many endpoints default to 10 items — but you should not assume that `10` applies everywhere.

When you provide a `limit`, the API may cap it at the maximum supported by that endpoint. `250` is a common maximum, but some endpoints or response types may use another value.

If the requested `limit` is higher than the supported maximum, the request is not rejected. The API clamps the value and returns up to the supported number of items instead.

For example, a request such as:

`?page=1&limit=500`

may be processed with an effective limit of `250`, or another endpoint-specific maximum.

For this reason, API clients should not assume that the requested `limit` is the limit that was actually applied. Use the pagination response headers to determine the effective page size and the number of available pages.

## Parameters

| Parameter | Type    | Default | Description                                                                        |
| --------- | ------- | ------- | ---------------------------------------------------------------------------------- |
| `page`    | integer | `1`     | Page of results to return.                                                         |
| `limit`   | integer | Varies  | Requested number of results per page. Defaults and maximums are endpoint-specific. |

## Pagination headers

Paginated responses include the following HTTP headers:

| Header                    | Description                         |
| ------------------------- | ----------------------------------- |
| `X-Pagination-Page`       | Current page.                       |
| `X-Pagination-Limit`      | Effective number of items per page. |
| `X-Pagination-Page-Count` | Total number of pages.              |
| `X-Pagination-Item-Count` | Total number of items.              |

When loading a complete dataset, continue requesting pages until all pages have been retrieved. Use the returned pagination headers rather than calculating the number of pages from the `limit` you requested.
