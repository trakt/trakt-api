import { afterEach, describe, expect, it, vi } from 'vitest';
import { accountSessionErrors } from './accountSessionErrors.ts';

afterEach(() => {
  accountSessionErrors.clear(0);
  accountSessionErrors.clear(1);
});

describe('account session errors', () => {
  it('notifies once per failed account without causing retry loops', () => {
    const changed = vi.fn();
    const stop = accountSessionErrors.subscribe(changed);
    accountSessionErrors.mark(0);
    accountSessionErrors.mark(0);
    expect(changed).toHaveBeenCalledTimes(1);
    expect(accountSessionErrors.has(0)).toBe(true);
    expect(accountSessionErrors.has(1)).toBe(false);
    stop();
  });

  it('clears a recovered session and unsubscribes observers', () => {
    const changed = vi.fn();
    const stop = accountSessionErrors.subscribe(changed);
    accountSessionErrors.mark(0);
    accountSessionErrors.clear(0);
    expect(accountSessionErrors.has(0)).toBe(false);
    stop();
    accountSessionErrors.mark(1);
    expect(changed).toHaveBeenCalledTimes(1);
  });
});
