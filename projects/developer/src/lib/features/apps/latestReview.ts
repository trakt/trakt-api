import type { ProductionReview } from './ProductionReview.ts';

export function latestReview(
  listed: ProductionReview | null | undefined,
  submitted: ProductionReview | null,
): ProductionReview | null {
  if (!submitted) return listed ?? null;
  if (!listed) return submitted;
  return submitted.id > listed.id ? submitted : listed;
}
