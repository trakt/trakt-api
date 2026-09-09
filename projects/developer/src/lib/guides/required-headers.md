---
updatedAt: 2026-05-19T09:09:04.000Z
---

# Required Headers

You'll need to send some **required** headers when making API calls to identify your application, set the version and set the content type to JSON.

| Header              | Value                                                        |                     |
| :------------------ | :----------------------------------------------------------- | :------------------ |
| `Content-Type`      | `application/json`                                           |                     |
| `User-Agent`        | We suggest using your app and version like `MyAppName/1.0.0` |                     |
| `trakt-api-key`     | Your `client_id` listed under your Trakt applications.       |                     |
| `trakt-api-version` | `2`                                                          | API version to use. |

All `POST`, `PUT`, and `DELETE` methods require a valid OAuth `access_token`. Some `GET` calls require OAuth and others will return user specific data if OAuth is sent. Methods that 🔒 **require** or have 🔓 **optional** OAuth will be indicated.

Your OAuth library should take care of sending the auth headers for you, but for reference here's how the Bearer token should be sent.

| Header          | Value                   |
| --------------- | ----------------------- |
| `Authorization` | `Bearer [access_token]` |
