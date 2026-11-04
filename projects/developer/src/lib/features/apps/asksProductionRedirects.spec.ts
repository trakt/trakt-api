import { describe, expect, it } from 'vitest';
import { asksProductionRedirects } from './asksProductionRedirects.ts';

describe('asksProductionRedirects', () => {
  it('asks only PKCE apps that need Production redirects', () => {
    expect(
      asksProductionRedirects({ redirectsNeeded: true, signIn: 'pkce' }),
    ).toBe(true);
    expect(
      asksProductionRedirects({ redirectsNeeded: true, signIn: 'device_code' }),
    ).toBe(false);
    expect(
      asksProductionRedirects({ redirectsNeeded: false, signIn: 'pkce' }),
    ).toBe(false);
  });
});
