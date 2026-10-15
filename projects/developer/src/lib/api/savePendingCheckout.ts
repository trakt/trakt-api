import { PENDING_CHECKOUT_KEY } from './PENDING_CHECKOUT_KEY.ts';
import type { PendingCheckout } from './PendingCheckout.ts';

export function savePendingCheckout({
  storage,
  pending,
}: {
  storage: Pick<Storage, 'setItem' | 'removeItem'> | undefined;
  pending: PendingCheckout | null;
}): boolean {
  if (!storage) return false;

  try {
    if (pending === null) storage.removeItem(PENDING_CHECKOUT_KEY);
    else storage.setItem(PENDING_CHECKOUT_KEY, JSON.stringify(pending));
    return true;
  } catch {
    return false;
  }
}
