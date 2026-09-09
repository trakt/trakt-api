---
updatedAt: 2026-09-09T04:15:38.005Z
---

# 👋 Trakt API - Introduction

At Trakt, we collect lots of interesting information about what tv shows and
movies everyone is watching. Part of the fun with such data is making it
available for anyone to mash up and use on their own site or app. The Trakt API
was made just for this purpose. It is very easy to use, you basically call a URL
and get some JSON back.

More complex API calls (such as adding a movie or episodes to your history)
involve sending us data. These are still easy to use, you simply POST some JSON
data to a specific URL.

Make sure to check out the
[Required Headers](/?section=guides&guide=required-headers) and
[Authentication](/?section=guides&guide=authentication-oauth) sections for more
info on what needs to be sent with each API call.

The API uses these terms to describe watching activity and how users organize
movies and shows:

| Term       | Description                                                                                                                         |
| ---------- | ----------------------------------------------------------------------------------------------------------------------------------- |
| Scrobble   | Automatically track what a user is watching by sending playback events when a movie or episode starts, pauses, or stops.            |
| Checkin    | Manually indicate that a user is watching a movie or episode right now. The item is marked as watched once its runtime has elapsed. |
| History    | A record of the movies and episodes a user has watched, including when they watched them and repeat viewings.                       |
| Watchlist  | Movies, shows, seasons, or episodes a user wants to watch.                                                                          |
| List       | A custom group of items organized by a user around a theme or purpose, with its own name, ordering, and privacy settings.           |
| Favorites  | A user's most-loved movies and shows. Favorites also help improve recommendations.                                                  |
