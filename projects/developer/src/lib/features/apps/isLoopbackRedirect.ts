const LOOPBACK_HOSTNAMES: ReadonlySet<string> = new Set([
  'localhost',
  '127.0.0.1',
  '[::1]',
]);

export function isLoopbackRedirect(uri: string): boolean {
  if (!URL.canParse(uri)) return false;
  const { protocol, hostname } = new URL(uri);
  return (protocol === 'http:' || protocol === 'https:') &&
    LOOPBACK_HOSTNAMES.has(hostname.toLowerCase());
}
