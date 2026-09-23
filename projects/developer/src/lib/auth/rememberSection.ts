import { RETURN_SECTION } from './RETURN_SECTION.ts';
import { safeReturnPath } from './safeReturnPath.ts';

export function rememberSection(): void {
  const url = new URL(globalThis.location.href);
  const target = url.pathname.startsWith('/apps')
    ? url.pathname
    : url.searchParams.get('section');
  globalThis.sessionStorage?.setItem(RETURN_SECTION, safeReturnPath(target));
}
