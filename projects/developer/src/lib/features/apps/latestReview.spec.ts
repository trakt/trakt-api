import { describe, expect, it } from 'vitest';
import type { ProductionReview } from './ProductionReview.ts';
import { latestReview } from './latestReview.ts';

const review = (id: number, status: ProductionReview['status']) =>
  ({
    id,
    kind: 'production',
    status,
    submitted_at: '2026-11-09T12:00:00Z',
    reviewed_at: null,
    review_note: null,
    client_secret_requested: false,
    granted_access: null,
  }) satisfies ProductionReview;

describe('latestReview', () => {
  it('uses the listed review until something was submitted', () => {
    expect(latestReview(review(1, 'declined'), null)?.id).toBe(1);
    expect(latestReview(undefined, null)).toBeNull();
  });

  it('keeps a just-submitted review when the list is stale', () => {
    expect(latestReview(undefined, review(2, 'pending'))?.status).toBe(
      'pending',
    );
    expect(latestReview(review(1, 'declined'), review(2, 'pending'))?.id).toBe(
      2,
    );
  });

  it('prefers the list once it has caught up or moved on', () => {
    expect(
      latestReview(review(2, 'granted'), review(2, 'pending'))?.status,
    ).toBe('granted');
    expect(latestReview(review(3, 'pending'), review(2, 'pending'))?.id).toBe(
      3,
    );
  });
});
