import { accountRequest } from './accountRequest.ts';
import { checkoutUrlSchema } from './checkoutUrlSchema.ts';

export async function updatePaymentMethodUrl({
  slot,
  successUrl,
  cancelUrl,
}: {
  slot: number;
  successUrl: string;
  cancelUrl: string;
}): Promise<string> {
  const query = new URLSearchParams({
    success_url: successUrl,
    cancel_url: cancelUrl,
  });
  const response = await accountRequest({
    slot,
    path: `/developer/stripe/update?${query}`,
    init: { method: 'POST' },
  });
  const parsed = checkoutUrlSchema.safeParse(await response.json());
  if (!parsed.success) {
    throw new Error('The billing page could not be opened. Please try again.');
  }

  return parsed.data.checkout_url;
}
