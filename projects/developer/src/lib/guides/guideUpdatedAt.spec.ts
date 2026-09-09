import { describe, expect, it } from 'vitest';
import { guideUpdatedAt } from './guideUpdatedAt.ts';

const now = Date.parse('2026-09-09T12:00:00Z');
const source = (date: string) => `---\nupdatedAt: ${date}\n---\n\n# Guide`;

describe('guideUpdatedAt', () => {
  it('formats the edit timestamp as relative and readable absolute dates', () => {
    expect(guideUpdatedAt(source('2026-07-30T13:19:17.000Z'), now)).toEqual({
      datetime: '2026-07-30T13:19:17.000Z',
      relative: 'about 1 month ago',
      date: 'July 30, 2026',
    });
  });

  it('handles recent edits and older articles', () => {
    for (
      const [date, label] of [
        ['2026-09-09', 'today'],
        ['2026-09-08', 'yesterday'],
        ['2026-09-04', '5 days ago'],
        ['2026-07-08', 'about 2 months ago'],
        ['2025-05-22', 'about 1 year ago'],
      ]
    ) {
      expect(guideUpdatedAt(source(date), now)?.relative).toBe(label);
    }
  });

  it('omits missing or invalid metadata rather than inventing an edit date', () => {
    expect(guideUpdatedAt('# Guide\nupdatedAt: 2026-07-30', now)).toBeNull();
    expect(guideUpdatedAt(source('invalid'), now)).toBeNull();
  });
});
