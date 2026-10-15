import { PENDING_CHECKOUT_KEY } from './PENDING_CHECKOUT_KEY.ts';
import type { PendingCheckout } from './PendingCheckout.ts';
import { pendingCheckoutSchema } from './pendingCheckoutSchema.ts';

export function readPendingCheckout(
  storage: Pick<Storage, 'getItem'> | undefined,
): PendingCheckout | null {
  try {
    const raw = storage?.getItem(PENDING_CHECKOUT_KEY);
    if (!raw) return null;

    const parsed = pendingCheckoutSchema.safeParse(JSON.parse(raw));
    return parsed.success ? parsed.data : null;
  } catch {
    return null;
  }
}
