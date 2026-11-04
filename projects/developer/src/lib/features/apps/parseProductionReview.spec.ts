import { describe, expect, it } from 'vitest';
import type { ApplicationProfileInput } from './ApplicationProfileInput.ts';
import { parseProductionReview } from './parseProductionReview.ts';

const profile: ApplicationProfileInput = {
  summary:
    'TV media player for people who keep their own home libraries. It syncs watch history and progress with Trakt.',
  open_source: false,
  product_links: ['https://example.app'],
  privacy_url: 'https://example.app/privacy',
  notice_links: ['https://example.app/about'],
  expected_mau: 2000,
  sign_in: 'pkce',
  writes_user_data: true,
  other_data_sources: null,
  other_sync_services: null,
};

const base = {
  profile,
  redirectsNeeded: true,
  redirects: ' https://example.app/callback \n\n',
  needsSecret: false,
  secretReason: '',
  confirmPolicy: true,
  confirmSecret: false,
  hasClientSecret: false,
};

describe('parseProductionReview', () => {
  it('sends trimmed https redirects when a PKCE app asks for Production', () => {
    expect(parseProductionReview(base)).toEqual({
      profile,
      redirect_uri: ['https://example.app/callback'],
      client_secret: null,
      confirm_api_use_policy: true,
    });
  });

  it('asks for no redirects on device code apps or later reviews', () => {
    expect(
      parseProductionReview({
        ...base,
        profile: { ...profile, sign_in: 'device_code' },
        redirects: 'http://localhost:5173',
      }).redirect_uri,
    ).toEqual([]);
    expect(
      parseProductionReview({ ...base, redirectsNeeded: false }).redirect_uri,
    ).toEqual([]);
  });

  it.each([
    ['', 'at least one production redirect URI'],
    ['http://example.app/callback', 'Change http://example.app/callback'],
    ['https://localhost:5173/callback', 'Change https://localhost'],
    ['myapp://callback', 'Change myapp://callback'],
  ])('refuses the production redirect %j', (redirects, message) => {
    expect(() => parseProductionReview({ ...base, redirects })).toThrow(
      message,
    );
  });

  it('needs a reason and the secret confirmation to ask for a Client Secret', () => {
    expect(() =>
      parseProductionReview({
        ...base,
        needsSecret: true,
        confirmSecret: true,
      }),
    ).toThrow('why your server needs');
    expect(() =>
      parseProductionReview({
        ...base,
        needsSecret: true,
        secretReason: 'Our server refreshes tokens.',
      }),
    ).toThrow('never ships');
    expect(
      parseProductionReview({
        ...base,
        needsSecret: true,
        secretReason: ' Our server refreshes tokens. ',
        confirmSecret: true,
      }),
    ).toMatchObject({
      client_secret: { reason: 'Our server refreshes tokens.' },
      confirm_secret_not_shipped: true,
    });
  });

  it('never asks again for a secret the app already has', () => {
    expect(
      parseProductionReview({
        ...base,
        needsSecret: true,
        hasClientSecret: true,
        confirmSecret: true,
      }),
    ).toMatchObject({ client_secret: null, confirm_secret_not_shipped: true });
  });

  it('never asks for a Client Secret for an app that only reads public data', () => {
    expect(
      parseProductionReview({
        ...base,
        profile: { ...profile, sign_in: 'none' },
        needsSecret: true,
        secretReason: 'Server refresh.',
        confirmSecret: true,
      }).client_secret,
    ).toBeNull();
  });

  it('requires the API Use Policy confirmation', () => {
    expect(() =>
      parseProductionReview({ ...base, confirmPolicy: false }),
    ).toThrow('API Use Policy');
  });
});
