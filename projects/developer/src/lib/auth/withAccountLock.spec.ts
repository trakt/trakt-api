import { afterEach, describe, expect, it, vi } from 'vitest';
import { withAccountLock } from './withAccountLock.ts';

afterEach(() => vi.unstubAllGlobals());

describe('account lock', () => {
  it('uses a distinct lock name for each account', async () => {
    const request = vi.fn(async (
      _name: string,
      operation: () => Promise<string>,
    ) => operation());
    vi.stubGlobal('navigator', { locks: { request } });
    await expect(withAccountLock(0, async () => 'zero')).resolves.toBe('zero');
    await expect(withAccountLock(1, async () => 'one')).resolves.toBe('one');
    expect(request.mock.calls.map(([name]) => name)).toEqual([
      'trakt-developer-account-0',
      'trakt-developer-account-1',
    ]);
  });

  it('fails safely when cross-tab coordination is unavailable', async () => {
    vi.stubGlobal('navigator', {});
    const operation = vi.fn();
    await expect(withAccountLock(0, operation)).rejects.toThrow('Web Locks');
    expect(operation).not.toHaveBeenCalled();
  });

  it('rejects invalid slots before accessing storage', async () => {
    const operation = vi.fn();
    await expect(withAccountLock(-1, operation)).rejects.toThrow('unavailable');
    expect(operation).not.toHaveBeenCalled();
  });
});
