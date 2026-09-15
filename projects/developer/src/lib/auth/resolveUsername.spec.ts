import { afterEach, describe, expect, it, vi } from 'vitest';
import { resolveUsername } from './resolveUsername.ts';

afterEach(() => vi.unstubAllGlobals());

function respondWith(body: unknown, status = 200) {
  vi.stubGlobal(
    'fetch',
    vi.fn().mockResolvedValue(
      new Response(JSON.stringify(body), { status }),
    ),
  );
}

describe('resolve username', () => {
  it('uses the username from account settings', async () => {
    respondWith({ user: { username: 'sean' } });
    await expect(resolveUsername({ accessToken: 't', slot: 0 }))
      .resolves.toBe('sean');
  });

  it('sends the token and the public client id', async () => {
    respondWith({ user: { username: 'sean' } });
    await resolveUsername({ accessToken: 'token-value', slot: 0 });

    const [url, init] = vi.mocked(globalThis.fetch).mock.calls[0]!;
    expect(url).toBe('https://api.trakt.tv/users/settings');
    expect(init?.headers).toMatchObject({
      authorization: 'Bearer token-value',
      'trakt-api-version': '2',
    });
  });

  it.each([
    ['the request fails', () => respondWith({}, 500)],
    ['the payload has no username', () => respondWith({ user: {} })],
    ['the username is empty', () => respondWith({ user: { username: '' } })],
    ['the body is not json', () =>
      vi.stubGlobal(
        'fetch',
        vi.fn().mockResolvedValue(new Response('not json')),
      )],
    [
      'the network is unavailable',
      () =>
        vi.stubGlobal('fetch', vi.fn().mockRejectedValue(new Error('offline'))),
    ],
  ])('falls back to the slot name when %s', async (_, arrange) => {
    arrange();
    await expect(resolveUsername({ accessToken: 't', slot: 2 }))
      .resolves.toBe('Account 3');
  });
});
