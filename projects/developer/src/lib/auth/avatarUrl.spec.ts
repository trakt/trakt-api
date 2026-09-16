import { expect, it } from 'vitest';
import { avatarUrl } from './avatarUrl.ts';
it.each([
  'https://media.trakt.tv/images/avatar.png',
  'media.trakt.tv/images/avatar.png',
  '//media.trakt.tv/images/avatar.png',
  'http://media.trakt.tv/images/avatar.png',
])('accepts settings avatar %s', (value) => {
  expect(avatarUrl(value)).toBe('https://media.trakt.tv/images/avatar.png');
});
it.each([
  null,
  '',
  'https://evil.example/avatar.png',
  'https://media.trakt.tv.evil.example/avatar.png',
  'https://user:password@media.trakt.tv/avatar.png',
  'javascript:alert(1)',
])('rejects invalid avatar %s', (value) => {
  expect(avatarUrl(value)).toBeNull();
});
