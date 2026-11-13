import { describe, expect, it } from 'vitest';
import type { ApplicationProfileInput } from './ApplicationProfileInput.ts';
import { checkProductionLinks } from './checkProductionLinks.ts';

const profile = {} as ApplicationProfileInput;
const report = {
  links: [
    { field: 'privacy_url', url: 'https://example.app/privacy', state: 'ok' },
  ],
  notice_found: true,
  privacy_mentions_trakt: null,
};

const answering = (body: unknown) => () =>
  Promise.resolve(new Response(JSON.stringify(body)));

describe('checkProductionLinks', () => {
  it('returns the report the API sends', async () => {
    expect(
      await checkProductionLinks({
        slot: 0,
        appId: 7,
        profile,
        request: answering(report),
      }),
    ).toEqual(report);
  });

  it('posts the profile to the app link check with a time limit', async () => {
    const calls: Parameters<
      NonNullable<Parameters<typeof checkProductionLinks>[0]['request']>
    >[0][] = [];

    await checkProductionLinks({
      slot: 2,
      appId: 7,
      profile,
      request: (call) => {
        calls.push(call);
        return Promise.resolve(new Response(JSON.stringify(report)));
      },
    });

    expect(calls[0]?.slot).toBe(2);
    expect(calls[0]?.path).toBe(
      '/v3/users/me/applications/7/production-review/link-check',
    );
    expect(calls[0]?.init?.method).toBe('POST');
    expect(calls[0]?.init?.signal).toBeInstanceOf(AbortSignal);
  });

  it('returns nothing when the answer is not a report', async () => {
    expect(
      await checkProductionLinks({
        slot: 0,
        appId: 7,
        profile,
        request: answering({ links: 'none' }),
      }),
    ).toBeNull();
  });

  it('returns nothing when the request fails or times out', async () => {
    expect(
      await checkProductionLinks({
        slot: 0,
        appId: 7,
        profile,
        request: () => Promise.reject(new DOMException('', 'TimeoutError')),
      }),
    ).toBeNull();
  });
});
