import { accountRequest } from './accountRequest.ts';

/**
 * Records a returning Checkout session right away; the Stripe webhook records
 * the same thing, so repeating this is harmless. Responds with no body.
 */
export async function confirmPremiumCheckout({
  slot,
  sessionId,
}: {
  slot: number;
  sessionId: string;
}): Promise<void> {
  await accountRequest({
    slot,
    path: `/developer/stripe/confirm?${new URLSearchParams({
      session_id: sessionId,
    })}`,
    init: { method: 'POST' },
  });
}
