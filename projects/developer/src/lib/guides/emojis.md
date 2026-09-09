---
updatedAt: 2025-05-22T12:26:48.000Z
---

# Emojis

We use short codes for emojis like `:smiley:` and `:raised_hands:` and render them on the Trakt website using [**JoyPixels**](https://www.joypixels.com/) *(verion 6.6.0)*. Methods that support emojis are tagged with 😁 **Emojis**. For POST methods, you can send standard unicode emojis and we'll automatically convert them to short codes. For GET methods, we'll return the unicode emojis if possible, but some short codes might also be returned. It's up to your app to convert short codes back to unicode emojis.
