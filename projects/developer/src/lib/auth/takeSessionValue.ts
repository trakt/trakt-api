export function takeSessionValue(key: string): string | null {
  const value = globalThis.sessionStorage?.getItem(key) ?? null;
  globalThis.sessionStorage?.removeItem(key);

  return value;
}
