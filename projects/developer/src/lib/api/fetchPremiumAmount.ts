import { accountRequest } from './accountRequest.ts';
import { premiumPlansSchema } from './premiumPlansSchema.ts';

export async function fetchPremiumAmount(slot: number): Promise<number | null> {
  try {
    const response = await accountRequest({ slot, path: '/developer/plans' });
    const parsed = premiumPlansSchema.safeParse(await response.json());
    if (!parsed.success) return null;

    return (
      parsed.data.find((plan) => plan.duration === 'monthly')?.amount ?? null
    );
  } catch {
    return null;
  }
}
