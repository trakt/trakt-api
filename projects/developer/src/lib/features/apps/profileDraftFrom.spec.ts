import { describe, expect, it } from 'vitest';
import type { ApplicationProfile } from './ApplicationProfile.ts';
import { parseApplicationProfile } from './parseApplicationProfile.ts';
import { profileDraftFrom } from './profileDraftFrom.ts';

const profile: ApplicationProfile = {
  summary:
    'TV media player for people who keep their own home libraries. It syncs watch history and progress with Trakt.',
  open_source: true,
  product_links: ['https://github.com/example/player', 'https://example.app'],
  privacy_url: 'https://example.app/privacy',
  notice_links: ['https://example.app/about'],
  expected_mau: 2000,
  sign_in: 'device_code',
  writes_user_data: true,
  other_data_sources: 'Another movie and show database',
  other_sync_services: null,
  updated_at: '2026-11-03T09:00:00.000Z',
  updated_by: { username: 'dev_example' },
};

describe('profileDraftFrom', () => {
  it('starts an empty draft for apps without app information', () => {
    expect(profileDraftFrom(null)).toMatchObject({
      summary: '',
      expectedMau: '',
      signIn: 'pkce',
      usesOtherData: false,
      syncsElsewhere: false,
    });
  });

  it('round-trips saved app information through the form', () => {
    const { updated_at: _at, updated_by: _by, ...input } = profile;

    expect(parseApplicationProfile(profileDraftFrom(profile))).toEqual(input);
  });
});
