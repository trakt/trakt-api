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
