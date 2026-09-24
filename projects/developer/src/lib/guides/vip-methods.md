---
updatedAt: 2026-09-24T00:00:00.000Z
---

# VIP Methods

## 🔥 VIP Only

Methods tagged **🔥 VIP Only** return `426` when the user needs VIP. Offer an upgrade action using `X-Upgrade-URL`, or [Trakt VIP](https://app.trakt.tv/vip) if the header is absent. Refresh settings when the user returns.

## 🔥 VIP Enhanced

Methods tagged **🔥 VIP Enhanced** offer higher allowances or additional capabilities with VIP. Offer an upgrade when it raises the relevant allowance; otherwise, explain how to make room.

See [User Account Limits](/?section=guides&guide=user-account-limits) for reading account allowances and handling `420` responses.
