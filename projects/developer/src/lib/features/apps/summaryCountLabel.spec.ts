import { describe, expect, it } from 'vitest';
import { summaryCountLabel } from './summaryCountLabel.ts';

describe('summaryCountLabel', () => {
  it('counts down to the minimum, ignoring surrounding spaces', () => {
    expect(summaryCountLabel('  ')).toBe('100 more characters needed.');
    expect(summaryCountLabel(` ${'a'.repeat(99)} `)).toBe(
      '1 more character needed.',
    );
  });

  it('shows the count against the limit once the minimum is reached', () => {
    expect(summaryCountLabel('a'.repeat(100))).toBe('100/500');
  });
});
