const RETURN_LOCATION_KEY = 'trakt-developer-return-to';

export function writeReturnLocation(): void {
  const { pathname, search, hash } = globalThis.location;
  globalThis.sessionStorage?.setItem(
    RETURN_LOCATION_KEY,
    `${pathname}${search}${hash}`,
  );
}

export function takeReturnLocation(): string {
  const stored = globalThis.sessionStorage?.getItem(RETURN_LOCATION_KEY) ??
    null;
  globalThis.sessionStorage?.removeItem(RETURN_LOCATION_KEY);

  // Reject anything that is not a plain path: "//host" is protocol-relative
  // and would navigate off the portal entirely.
  return stored?.startsWith('/') && !stored.startsWith('//') ? stored : '/';
}
