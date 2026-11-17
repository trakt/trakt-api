---
updatedAt: 2026-11-17T00:00:00.000Z
---

# ✅ Create an App

To use the Trakt API, you'll first need to [**create a new API app**](/apps).

Once done, you'll have everything you need to use the API: your Client ID.
Sign users in with [PKCE](/docs/pkce), which does not need a Client Secret.

Creating an app requires a verified GitHub account. Connect it once from the
Developer panel on My Apps, and every app you create afterwards uses it.

By creating an app, you agree to the following terms:

* All [branding requirements](https://app.trakt.tv/branding) must be followed.
* Trakt data cannot be used in apps or websites that promote copyright infringement or piracy.
* Trakt data is provided as is with no warranty. We don't offer any legal protection and Trakt can't be held liable for the actions of your app.
* Your account email and app information must be kept up to date so we can contact you if needed.
* All API announcements and discussions take place in the [GitHub developer community](https://github.com/trakt/trakt-api).
* It is required to watch and subscribe to notifications in the repository so we can announce to all developers at once.
* Use only **documented API methods** and please don't scrape the website for information.
* Please don't create additional API apps to avoid rate limits or other API restrictions we put in place.
* Be a good API developer and remember the API is shared by a lot of apps. Make sure to effectively cache data and keep your API hits as low as you can. Optimized API usage helps everyone!

## Going to production

Every app starts as a **Development** app: you and up to 16 people you invite
can sign in, and any redirect URI works for testing, including localhost,
hosted test sites and custom app schemes. Apps for yourself or a few people
stay on Development.

When your app is ready for everyone, open it from [My Apps](/apps) and choose
**Request Production access**. Premium developers see **Create Production app**
instead. Once access is granted, you get a separate **Production app** with its
own Client ID, and your Development app stays your sandbox.

Have these ready before you start:

* A short description of what your app does and who it's for (100 to 500 characters).
* At least one link to your app: repository, docs, store page, TestFlight or website.
* A link to your privacy policy.
* At least one link showing the notice "*Your app* uses Trakt but is not endorsed or certified by Trakt". A page, a README, or a screenshot or video you host is fine.
* How many monthly active users you expect, how your app uses Trakt, and which other services it relies on.
* For apps that sign users in with PKCE, your production redirect URIs: `https://` on a domain you control. Production apps don't accept localhost or custom app schemes; on mobile, use Universal Links or verified App Links.

Apps that only read public data (trending, search, ratings) get **read-only**
Production access: they use their own Client ID and nobody can sign in to
them. To let users sign in later, request another review.

Apps get no Client Secret by default. If your server exchanges and refreshes
tokens itself, ask for one in the same form and tell us why.

Every request is checked automatically when you send it. If nothing needs a
closer look, your Production app is granted right away, and later changes to
your app information apply right away too. If a check flags something, the
request waits for a person, usually within a few business days, and nothing
changes until it's granted. Premium developers get their Production app right
away either way. A Client Secret is always reviewed by a person: that part of
the request waits until we grant it.

We also look at apps after they go live, so please keep your app information
accurate. If something doesn't match how your app works, we'll email you what
to change and give you 14 days to update it. An app whose information stays
incorrect can be suspended until it's fixed.

Granting Production access is not a review, endorsement or certification of
your app or how you use it. You stay responsible for following the
[API Use Policy](/docs/api-use-policy) and the law, and Trakt can remove access
at any time.
