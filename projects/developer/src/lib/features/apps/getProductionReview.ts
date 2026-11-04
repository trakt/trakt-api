import { accountRequest } from '$lib/api/accountRequest.ts';
import type { ProductionReviewDetail } from './ProductionReviewDetail.ts';
import { productionReviewDetailSchema } from './productionReviewDetailSchema.ts';

export async function getProductionReview(
  slot: number,
  appId: number,
): Promise<ProductionReviewDetail> {
  const response = await accountRequest({
    slot,
    path: `/v3/users/me/applications/${appId}/production-review`,
  });
  const parsed = productionReviewDetailSchema.safeParse(await response.json());
  if (!parsed.success) {
    throw new Error('Your last review could not be read. Please try again.');
  }
  return parsed.data;
}
