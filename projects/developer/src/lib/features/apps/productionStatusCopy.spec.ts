import { describe, expect, it } from 'vitest';
import { formatDate } from './formatDate.ts';
import type { ProductionReview } from './ProductionReview.ts';
import { productionStatusCopy } from './productionStatusCopy.ts';

const submitted_at = '2026-11-03T09:00:00.000Z';
const reviewed_at = '2026-11-05T09:00:00.000Z';

function review(change: Partial<ProductionReview>): ProductionReview {
  return {
    id: 1,
    kind: 'production',
    status: 'pending',
    submitted_at,
    client_secret_requested: false,
    ...change,
  };
}

describe('productionStatusCopy', () => {
  it('returns nothing when the app never asked for a review', () => {
    expect(productionStatusCopy(null)).toBeNull();
    expect(productionStatusCopy(undefined)).toBeNull();
  });

  it('dates a pending review by when it was sent and says nothing changes yet', () => {
    expect(productionStatusCopy(review({}))).toMatchObject({
      title: `Review requested · ${formatDate(submitted_at)}`,
      detail: expect.stringMatching(/Nothing changes until then/),
      tone: 'info',
    });
  });

  it.each(['granted', 'granted_instantly'] as const)(
    'says Production access was granted, never approved, for a first %s review',
    (status) => {
      const copy = productionStatusCopy(review({ status, reviewed_at }));

      expect(copy?.title).toMatch(/^Production access granted/);
      expect(copy?.detail).toMatch(/Production app is ready/);
      expect(copy?.detail).toMatch(/doesn't mean Trakt endorses/);
      expect(JSON.stringify(copy)).not.toMatch(/approv/i);
    },
  );

  it('calls a granted later review a change, not new access', () => {
    expect(
      productionStatusCopy(
        review({ kind: 'update', status: 'granted', reviewed_at }),
      )?.title,
    ).toBe(`Changes granted · ${formatDate(reviewed_at)}`);
  });

  it('says when access was granted read-only and how to change it', () => {
    const copy = productionStatusCopy(
      review({ status: 'granted', reviewed_at, granted_access: 'read_only' }),
    );

    expect(copy?.title).toBe(
      `Read-only Production access granted · ${formatDate(reviewed_at)}`,
    );
    expect(copy?.detail).toMatch(/Nobody can sign in to it/);
    expect(copy?.detail).toMatch(/doesn't mean Trakt endorses/);
  });

  it('describes a historical read-only grant using the actual Production access', () => {
    const copy = productionStatusCopy(
      review({
        kind: 'update',
        status: 'granted',
        granted_access: 'read_only',
      }),
      true,
    );

    expect(copy?.title).toMatch(/^Changes granted/);
    expect(copy?.detail).not.toMatch(/Nobody can sign in/);
  });

  it('tells a declined developer that nothing changed and they can ask again', () => {
    expect(
      productionStatusCopy(review({ status: 'declined', reviewed_at })),
    ).toMatchObject({
      title: `Review declined · ${formatDate(reviewed_at)}`,
      detail: expect.stringMatching(/request another review/),
      tone: 'danger',
    });
  });
});
