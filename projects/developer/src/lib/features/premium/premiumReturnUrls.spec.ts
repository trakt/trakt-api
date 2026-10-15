import { describe, expect, it } from 'vitest';
import { premiumReturnUrls } from './premiumReturnUrls.ts';

describe('premiumReturnUrls', () => {
  it('sends both outcomes back to the plans page', () => {
    expect(premiumReturnUrls('https://developer.trakt.tv')).toEqual({
      successUrl: 'https://developer.trakt.tv/premium',
      cancelUrl: 'https://developer.trakt.tv/premium?checkout=cancelled',
    });
  });
});
