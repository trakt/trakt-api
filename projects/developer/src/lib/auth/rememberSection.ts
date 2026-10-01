import { RETURN_SECTION } from './RETURN_SECTION.ts';
import { safeReturnPath } from './safeReturnPath.ts';

export function rememberSection(): void {
  const url = new URL(globalThis.location.href);
  const section = url.searchParams.get('section');
  const target = url.pathname.startsWith('/apps') ||
      url.pathname.startsWith('/docs/')
    ? url.pathname
    : section === 'reference'
    ? `/?section=reference${url.hash}`
    : section;
  globalThis.sessionStorage?.setItem(RETURN_SECTION, safeReturnPath(target));
}
