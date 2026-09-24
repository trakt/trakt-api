import { afterEach, describe, expect, it, vi } from 'vitest';
import { signInAccount } from './signInAccount.ts';
import { userManager } from './userManager.ts';

vi.mock('./userManager.ts', () => ({ userManager: vi.fn() }));

afterEach(() => vi.unstubAllGlobals());

describe('sign in account', () => {
  it.each([
    [0, false, false],
    [0, true, true],
    [1, false, true],
  ])(
    'requests account choice for slot %i with existing session %s',
    async (slot, existing, promptLogin) => {
      vi.stubGlobal('location', { href: 'https://developer.trakt.tv/apps' });
      vi.stubGlobal('sessionStorage', { setItem: vi.fn() });
      const signinRedirect = vi.fn();
      vi.mocked(userManager).mockReturnValue({
        getUser: async () => existing ? {} : null,
        signinRedirect,
      } as unknown as ReturnType<typeof userManager>);

      await signInAccount(slot);
      expect(signinRedirect).toHaveBeenCalledWith(
        promptLogin ? { extraQueryParams: { prompt: 'login' } } : {},
      );
    },
  );
});
