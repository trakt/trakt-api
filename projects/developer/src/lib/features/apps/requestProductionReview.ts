import { accountRequest } from '$lib/api/accountRequest.ts';
import type { ProductionReview } from './ProductionReview.ts';
import type { ProductionReviewInput } from './ProductionReviewInput.ts';
import { productionReviewSchema } from './productionReviewSchema.ts';

export async function requestProductionReview({
  slot,
  appId,
  input,
}: {
  slot: number;
  appId: number;
  input: ProductionReviewInput;
}): Promise<ProductionReview> {
  const response = await accountRequest({
    slot,
    path: `/v3/users/me/applications/${appId}/production-review`,
    init: { method: 'POST', body: JSON.stringify(input) },
  });
  const parsed = productionReviewSchema.safeParse(await response.json());
  if (!parsed.success) {
    throw new Error('Your request was sent but its status could not be read.');
  }
  return parsed.data;
}
