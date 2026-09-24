import type { UserManager } from 'oidc-client-ts';
import { accountSessionErrors } from './accountSessionErrors.ts';
import { ACCOUNT_LIMIT } from './ACCOUNT_LIMIT.ts';
import { userManager } from './userManager.ts';

export function observeAccountChanges(
  onChange: () => void,
  { manager = userManager, target = globalThis }: {
    manager?: (slot: number) => Pick<UserManager, 'events'>;
    target?: Pick<Window, 'addEventListener' | 'removeEventListener'>;
  } = {},
): () => void {
  const slots = Array.from({ length: ACCOUNT_LIMIT }, (_, slot) => slot);
  const subscriptions = slots.flatMap((slot) => {
    const events = manager(slot).events;
    const changed = () => {
      accountSessionErrors.clear(slot);
      onChange();
    };

    return [events.addUserLoaded(changed), events.addUserUnloaded(changed)];
  });
  const stopObservingErrors = accountSessionErrors.subscribe(onChange);

  function onStorage(event: StorageEvent) {
    const sessionSlot = event.key?.match(
      /^trakt-developer-account-(\d+)\.user:/,
    )?.at(1);

    if (sessionSlot !== undefined) {
      accountSessionErrors.clear(Number(sessionSlot));
    }
    if (event.key === null) {
      slots.forEach(accountSessionErrors.clear);
    }

    if (
      event.key === null || sessionSlot !== undefined ||
      event.key.startsWith('trakt-developer-username-')
    ) onChange();
  }

  target.addEventListener('storage', onStorage);

  return () => {
    subscriptions.forEach((unsubscribe) => unsubscribe());
    stopObservingErrors();
    target.removeEventListener('storage', onStorage);
  };
}
