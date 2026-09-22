import { isAccountSlot } from './accountSlots.ts';
const ACTIVE_SLOT = 'trakt-developer-active-slot';
const RETURN_SECTION = 'trakt-developer-return-section';
export function selectedSlot(): number | null {
  const value = globalThis.sessionStorage?.getItem(ACTIVE_SLOT);
  if (value == null) return null;
  const slot = Number(value);
  return isAccountSlot(slot) ? slot : null;
}
export function rememberSlot(slot: number): void {
  globalThis.sessionStorage?.setItem(ACTIVE_SLOT, String(slot));
}
export function safeReturnPath(value: string | null): string {
  if (value && /^\/apps(?:\/(?:new|[1-9]\d*(?:\/edit)?))?\/?$/.test(value)) {
    return value.replace(/\/$/, '');
  }
  if (value === 'apps') return '/apps';
  if (value === 'reference' || value === '/?section=reference') {
    return '/?section=reference';
  }
  return '/';
}
export function rememberSection(): void {
  const url = new URL(globalThis.location.href);
  const target = url.pathname.startsWith('/apps')
    ? url.pathname
    : url.searchParams.get('section');
  globalThis.sessionStorage?.setItem(RETURN_SECTION, safeReturnPath(target));
}
export function takeReturnPath(): string {
  const stored = globalThis.sessionStorage?.getItem(RETURN_SECTION);
  globalThis.sessionStorage?.removeItem(RETURN_SECTION);
  return safeReturnPath(stored);
}
