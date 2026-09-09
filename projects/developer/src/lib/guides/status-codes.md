---
updatedAt: 2026-05-19T09:15:22.000Z
---

# Status Codes

The API will respond with one of the following HTTP status codes.

| Code  | Description                                                  |
| ----- | ------------------------------------------------------------ |
| `200` | Success                                                      |
| `201` | Success - *new resource created (POST)*                      |
| `204` | Success - *no content to return (DELETE)*                    |
| `400` | Bad Request - *request couldn't be parsed*                   |
| `401` | Unauthorized - *OAuth must be provided*                      |
| `403` | Forbidden - *invalid API key or unapproved app*              |
| `404` | Not Found - *method exists, but no record found*             |
| `405` | Method Not Found - *method doesn't exist*                    |
| `409` | Conflict - *resource already created*                        |
| `412` | Precondition Failed - *use application/json content type*    |
| `420` | Account Limit Exceeded - *list count, item count, etc*       |
| `422` | Unprocessable Entity - *validation errors*                   |
| `423` | Locked User Account - *have the user contact support*        |
| `426` | VIP Only - *user must upgrade to VIP*                        |
| `429` | Rate Limit Exceeded                                          |
| `500` | Server Error - *please open a support ticket*                |
| `502` | Service Unavailable - *server overloaded (try again in 30s)* |
| `503` | Service Unavailable - *server overloaded (try again in 30s)* |
| `504` | Service Unavailable - *server overloaded (try again in 30s)* |
| `520` | Service Unavailable - *Cloudflare error*                     |
| `521` | Service Unavailable - *Cloudflare error*                     |
| `522` | Service Unavailable - *Cloudflare error*                     |
