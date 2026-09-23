import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { fetchAccountProfile } from './fetchAccountProfile.ts';
import { accessToken } from '$lib/auth/accessToken.ts';

vi.mock('$lib/auth/accessToken.ts', () => ({ accessToken: vi.fn() }));

function respondWith(body: string, init?: ResponseInit) {
  vi.stubGlobal('fetch', vi.fn().mockResolvedValue(new Response(body, init)));
}

beforeEach(() => vi.mocked(accessToken).mockResolvedValue('token-value'));
afterEach(() => vi.unstubAllGlobals());

describe('fetchAccountProfile', () => {
  it('derives vip and avatar from the account settings response', async () => {
    respondWith(JSON.stringify({
      user: {
        vip: true,
        images: { avatar: { full: 'https://media.trakt.tv/avatar.jpg' } },
      },
    }));

    await expect(fetchAccountProfile(1)).resolves.toEqual({
      vip: true,
      avatar: 'https://media.trakt.tv/avatar.jpg',
    });
  });

  it('treats vip_ep as vip when vip is not set', async () => {
    respondWith(JSON.stringify({ user: { vip_ep: true } }));

    await expect(fetchAccountProfile(1)).resolves.toEqual({
      vip: true,
      avatar: null,
    });
  });

  it('falls back to a non-vip profile with no avatar when fields are missing', async () => {
    respondWith(JSON.stringify({}));

    await expect(fetchAccountProfile(1)).resolves.toEqual({
      vip: false,
      avatar: null,
    });
  });

  it('drops an unsafe avatar url the same way avatarUrl does', async () => {
    respondWith(JSON.stringify({
      user: { images: { avatar: { full: 'javascript:alert(1)' } } },
    }));

    await expect(fetchAccountProfile(1)).resolves.toEqual({
      vip: false,
      avatar: null,
    });
  });

  it('returns null when the account has no token', async () => {
    respondWith('{}');
    vi.mocked(accessToken).mockResolvedValue(null);

    await expect(fetchAccountProfile(1)).resolves.toBeNull();
  });

  it('returns null when the request fails', async () => {
    respondWith('{}', { status: 401 });

    await expect(fetchAccountProfile(1)).resolves.toBeNull();
  });

  it('returns null when the response body is not valid json', async () => {
    respondWith('not json');

    await expect(fetchAccountProfile(1)).resolves.toBeNull();
  });

  it('returns null when the response body is json null', async () => {
    respondWith('null');

    await expect(fetchAccountProfile(1)).resolves.toBeNull();
  });
});
