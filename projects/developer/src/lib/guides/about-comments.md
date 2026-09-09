---
updatedAt: 2026-05-19T14:18:31.000Z
---

# About Comments

Comments are attached to any movie, show, season, episode, or list and can be a quick shout or a more detailed review. Each comment can have replies and can be liked. These likes are used to determine popular comments. Comments must follow these rules and your app should indicate these to the user. Failure to adhere to these rules could suspend the user's commenting abilities.

* Comments must be at least 5 words.
* Comments 200 words or longer will be automatically marked as a review.
* Correctly indicate if the comment contains spoilers.
* Only write comments in English - **This is important!**
* **Do not include** app specific text like (via App Name) or #apphashtag. This clutters up the comments and failure to clean the comment text could get your app blacklisted from commenting.

#### Possible Error Responses

| Code  | Description                              |
| ----- | ---------------------------------------- |
| `401` | Invalid user                             |
| `401` | User banned from commenting              |
| `404` | Item not found or doesn't allow comments |
| `409` | Comment can't be deleted                 |
| `422` | Validation errors                        |

#### Validation Errors

If a comment doesn't pass validation, it returns a `422` HTTP error code and an array of validation errors in the response. The validation errors could include:

| Error Message                |
| ---------------------------- |
| `must be at least 5 words`   |
| `must be written in English` |

#### Comment Formatting

Comments support [**markdown**](https://en.wikipedia.org/wiki/Markdown) formatting so you'll want to render this in your app so it matches what the website does. In addition, we support inline spoiler tags like `[spoiler]text[/spoiler]` which you should also handle independent of the top level `spoiler` attribute.
