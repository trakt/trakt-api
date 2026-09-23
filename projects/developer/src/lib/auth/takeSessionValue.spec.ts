import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { takeSessionValue } from './takeSessionValue.ts';

function memoryStorage() {
  const values = new Map<string, string>();
  return {
    getItem: (key: string) => values.get(key) ?? null,
    setItem: (key: string, value: string) => void values.set(key, value),
    removeItem: (key: string) => void values.delete(key),
  };
}

beforeEach(() => vi.stubGlobal('sessionStorage', memoryStorage()));

afterEach(() => vi.unstubAllGlobals());

describe('takeSessionValue', () => {
  it('returns the stored value', () => {
    globalThis.sessionStorage.setItem('key', 'value');
    expect(takeSessionValue('key')).toBe('value');
  });

  it('removes the value so it cannot be read again', () => {
    globalThis.sessionStorage.setItem('key', 'value');
    takeSessionValue('key');
    expect(takeSessionValue('key')).toBeNull();
  });

  it('returns null when no value is stored', () => {
    expect(takeSessionValue('missing')).toBeNull();
  });
});
