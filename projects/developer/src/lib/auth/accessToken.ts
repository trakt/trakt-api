import { accountSessionErrors } from './accountSessionErrors.ts';
import { createAccessTokenProvider } from './createAccessTokenProvider.ts';
import { userManager } from './userManager.ts';
import { withAccountLock } from './withAccountLock.ts';

export const accessToken = createAccessTokenProvider({
  manager: userManager,
  onSessionError: accountSessionErrors.mark,
  lock: withAccountLock,
  storage: () => globalThis.localStorage,
});
