import { describe, expect, it, vi } from 'vitest';
import { authFetch } from './authFetch.ts';

const timedRequest = {
  timeoutInSeconds: 15,
  signal: new AbortController().signal,
};

describe('authentication fetch', () => {
  it('buffers timed OIDC responses without replacing their metadata or consuming their body', async () => {
    const response = new Response('{"ok":true}', {
      headers: { 'content-type': 'application/json' },
    });
    const fetcher = vi.fn().mockResolvedValue(response);
    const result = await authFetch(fetcher)(
      'https://auth.trakt.tv/oauth/token',
      timedRequest,
    );
    expect(result).toBe(response);
    expect(result.bodyUsed).toBe(false);
    expect(await result.json()).toEqual({ ok: true });
    expect(fetcher).toHaveBeenCalledWith(
      'https://auth.trakt.tv/oauth/token',
      timedRequest,
    );
  });

  it.each([
    ['https://api.trakt.tv/users/settings', {}],
    ['https://auth.trakt.tv/oauth/token', {}],
    ['https://example.com/resource', {}],
  ])('leaves unrelated requests unbuffered: %s', async (url, init) => {
    const response = new Response('unchanged');
    const clone = vi.spyOn(response, 'clone');
    const fetcher = vi.fn().mockResolvedValue(response);
    expect(await authFetch(fetcher)(url, init)).toBe(response);
    expect(clone).not.toHaveBeenCalled();
  });

  it('does not wrap the same fetch more than once', () => {
    const wrapped = authFetch(vi.fn());
    expect(authFetch(wrapped)).toBe(wrapped);
  });
});
