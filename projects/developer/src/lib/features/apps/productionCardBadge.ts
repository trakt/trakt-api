import type { ProductionReview } from './ProductionReview.ts';
import type { ProductionStatus } from './ProductionStatus.ts';
import { productionStatusCopy } from './productionStatusCopy.ts';

const SHOWN_ON_CARD: ReadonlySet<ProductionStatus> = new Set([
  'pending',
  'changes_requested',
  'declined',
]);

export function productionCardBadge(
  review: ProductionReview | null | undefined,
): { label: string; status: ProductionStatus } | null {
  if (!review || !SHOWN_ON_CARD.has(review.status)) return null;

  const copy = productionStatusCopy(review);
  return copy ? { label: copy.badge, status: review.status } : null;
}
