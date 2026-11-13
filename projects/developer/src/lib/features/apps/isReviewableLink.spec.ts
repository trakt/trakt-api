import { describe, expect, it } from 'vitest';
import { isReviewableLink } from './isReviewableLink.ts';

describe('isReviewableLink', () => {
  it('accepts a page on a public domain', () => {
    expect(isReviewableLink('https://myapp.io/privacy')).toBe(true);
    expect(isReviewableLink('https://github.com/me/app#credits')).toBe(true);
  });

  it.each([
    'https://example.com/about',
    'https://www.example.org',
    'http://localhost:3000',
    'http://127.0.0.1/privacy',
    'https://myapp.local',
    'https://app.trakt.tv/about',
    'https://i.imgur.com/sr9G4hx.png',
    'https://.streamen.app',
    'https://intranet/privacy',
  ])('refuses %s', (link) => {
    expect(isReviewableLink(link)).toBe(false);
  });
});
