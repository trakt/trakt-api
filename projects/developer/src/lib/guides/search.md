---
updatedAt: 2026-06-19T09:20:06.000Z
---

# Search

Use Trakt search when you want to find a specific movie or show by title.

## Recommended Title Search Flow

To provide the best search experience, call both exact search and broader search, then combine the results:

1. Use exact search first for strong title matches.
2. Use broader search second for fuzzy and expanded matches.
3. De-duplicate results by Trakt ID.
4. Show exact matches first, followed by broader results.

This matches how Trakt's own frontend search works.

## Exact Search

Use [exact search](/?section=reference&operation=getSearchExact) when the user is looking for a known movie or show title.

```http
GET /search/movie/exact?query=weapons
```

For shows:

```http
GET /search/show/exact?query=from
```

Exact search is best for title-first results and should be the first request in an autocomplete or search results UI.

## Broader Search

Use the broader [search](/?section=reference&operation=getSearchQuery) endpoint to include fuzzy matches and other relevant results.

```http
GET /search/movie?query=weapons
```

For shows:

```http
GET /search/show?query=from
```

Broader search can return useful related results, but ranking may differ from exact title expectations.

## Example Combined Flow

```text
exactResults = GET /search/movie/exact?query=weapons&extended=full&page=1&limit=1
broadResults = GET /search/movie?query=weapons&extended=full&page=1&limit=50

results = dedupeByTraktId([
  ...exactResults,
  ...broadResults,
])
```

Display the combined results in that order.
