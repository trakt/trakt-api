const REFERENCE_PATH = /^\/\?section=reference(#[\w=&.%~-]*)?$/;

export function safeReturnPath(value: string | null): string {
  if (value && /^\/apps(?:\/(?:new|[1-9]\d*(?:\/edit)?))?\/?$/.test(value)) {
    return value.replace(/\/$/, '');
  }
  if (value === 'apps') return '/apps';
  if (value === 'reference') return '/?section=reference';
  if (value && REFERENCE_PATH.test(value)) return value;
  return '/';
}
