import { accountRequest } from './accountRequest.ts';

export async function cancelPremiumSubscription(slot: number): Promise<void> {
  await accountRequest({
    slot,
    path: '/developer/stripe/cancel',
    init: { method: 'POST' },
  });
}
