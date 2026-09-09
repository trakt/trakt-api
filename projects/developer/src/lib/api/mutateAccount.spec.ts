import { afterEach, describe, expect, it, vi } from 'vitest';
import { mutateAccount } from './mutateAccount.ts';

afterEach(() => vi.unstubAllGlobals());

describe('account actions', () => {
  it.each([['POST', '/refresh'], ['DELETE', '']] as const)(
    'sends %s to the selected account',
    async (method, suffix) => {
      const fetch = vi.fn().mockResolvedValue(new Response('{}'));
      vi.stubGlobal('fetch', fetch);
      await mutateAccount(3, method);
      expect(fetch).toHaveBeenCalledWith(`/api/accounts/3${suffix}`, {
        method,
      });
    },
  );

  it('reports refresh failure without exposing the upstream body', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue(new Response('private token', { status: 502 })),
    );
    await expect(mutateAccount(0, 'POST')).rejects.toThrow(
      'Could not refresh access token (502)',
    );
  });

  it('reports failed logout instead of treating it as success', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue(new Response('', { status: 403 })),
    );
    await expect(mutateAccount(0, 'DELETE')).rejects.toThrow(
      'Could not log out (403)',
    );
  });

  it('reports network failures', async () => {
    vi.stubGlobal('fetch', vi.fn().mockRejectedValue(new Error('network')));
    await expect(mutateAccount(0, 'POST')).rejects.toThrow(
      'Check your connection',
    );
  });
});
