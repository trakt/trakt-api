import { expect, it } from 'vitest';
import { productionCardBadge } from './productionCardBadge.ts';

const base = {
  id: 1,
  kind: 'production' as const,
  submitted_at: '2026-11-03T09:00:00.000Z',
  client_secret_requested: false,
};

it.each([
  ['pending', 'Review requested'],
  ['changes_requested', 'Changes requested'],
  ['declined', 'Review declined'],
  ['suspended', 'Production access suspended'],
] as const)('flags %s reviews on the app card', (status, label) => {
  expect(productionCardBadge({ ...base, status })).toEqual({ label, status });
});

it.each(['granted', 'granted_instantly'] as const)(
  'leaves %s apps without a badge',
  (status) => {
    expect(productionCardBadge({ ...base, status })).toBeNull();
  },
);

it('has no badge for apps that never asked', () => {
  expect(productionCardBadge(null)).toBeNull();
});
