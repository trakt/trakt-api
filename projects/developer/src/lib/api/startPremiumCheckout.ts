import { accountRequest } from './accountRequest.ts';
import { checkoutUrlSchema } from './checkoutUrlSchema.ts';

export async function startPremiumCheckout({
  slot,
  successUrl,
  cancelUrl,
}: {
  slot: number;
  successUrl: string;
  cancelUrl: string;
}): Promise<string> {
  const query = new URLSearchParams({
    duration: 'monthly',
    success_url: successUrl,
    cancel_url: cancelUrl,
  });
  const response = await accountRequest({
    slot,
    path: `/developer/stripe/create?${query}`,
    init: { method: 'POST' },
  });
  const parsed = checkoutUrlSchema.safeParse(await response.json());
  if (!parsed.success) {
    throw new Error('Checkout could not be started. Please try again.');
  }

  return parsed.data.checkout_url;
}
