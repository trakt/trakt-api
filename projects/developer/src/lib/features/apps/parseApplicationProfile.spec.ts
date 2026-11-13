import { describe, expect, it } from 'vitest';
import type { ApplicationProfileDraft } from './ApplicationProfileDraft.ts';
import { parseApplicationProfile } from './parseApplicationProfile.ts';

const draft: ApplicationProfileDraft = {
  summary:
    ' TV media player for people who keep their own home libraries. It syncs watch history and progress with Trakt. ',
  openSource: true,
  productLinks: 'https://github.com/example/player, https://example.app',
  privacyUrl: ' https://example.app/privacy ',
  noticeLinks: 'https://github.com/example/player#readme',
  expectedMau: '2000',
  signIn: 'pkce',
  writesUserData: true,
  usesOtherData: false,
  otherDataSources: 'ignored',
  syncsElsewhere: true,
  otherSyncServices: ' Another tracker ',
};

describe('parseApplicationProfile', () => {
  it('turns a complete draft into the API payload', () => {
    expect(parseApplicationProfile(draft)).toEqual({
      summary:
        'TV media player for people who keep their own home libraries. It syncs watch history and progress with Trakt.',
      open_source: true,
      product_links: [
        'https://github.com/example/player',
        'https://example.app',
      ],
      privacy_url: 'https://example.app/privacy',
      notice_links: ['https://github.com/example/player#readme'],
      expected_mau: 2000,
      sign_in: 'pkce',
      writes_user_data: true,
      other_data_sources: null,
      other_sync_services: 'Another tracker',
    });
  });

  it('never reports writes for an app that uses public data only', () => {
    expect(
      parseApplicationProfile({ ...draft, signIn: 'none' }).writes_user_data,
    ).toBe(false);
  });

  it.each([
    [{ summary: '  ' }, 'at least 100 characters'],
    [{ summary: 'a'.repeat(99) }, 'at least 100 characters'],
    [{ summary: 'a'.repeat(501) }, 'within 500 characters'],
    [{ productLinks: ' , ' }, 'at least one link to your app'],
    [{ productLinks: 'ftp://example.app' }, "isn't a valid"],
    [
      {
        productLinks: Array(11)
          .fill('https://x.example/')
          .map((url, index) => `${url}${index}`)
          .join(','),
      },
      'up to 10',
    ],
    [{ privacyUrl: 'example.app/privacy' }, 'privacy policy'],
    [{ noticeLinks: '' }, 'at least one notice link'],
    [{ expectedMau: '2k' }, 'as a number'],
    [{ expectedMau: '-5' }, 'as a number'],
    [{ usesOtherData: true, otherDataSources: ' ' }, 'other data sources'],
    [{ otherSyncServices: 'x'.repeat(256) }, 'within 255 characters'],
  ] as const)('rejects %o', (change, message) => {
    expect(() => parseApplicationProfile({ ...draft, ...change })).toThrow(
      message,
    );
  });

  it('accepts descriptions of 100 to 500 characters and the smallest Production audience', () => {
    const parsed = parseApplicationProfile({
      ...draft,
      summary: 'a'.repeat(500),
      expectedMau: '17',
    });

    expect(parsed.summary).toHaveLength(500);
    expect(
      parseApplicationProfile({ ...draft, summary: 'a'.repeat(100) }).summary,
    ).toHaveLength(100);
    expect(parsed.expected_mau).toBe(17);
  });
});
