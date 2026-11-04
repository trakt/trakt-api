const LOCAL_HOSTS: ReadonlySet<string> = new Set(['localhost', '0.0.0.0']);

// Loopback, private (RFC 1918), and link-local IPv4 ranges.
const PRIVATE_IPV4 =
  /^(127\.|10\.|192\.168\.|169\.254\.|172\.(1[6-9]|2\d|3[01])\.)/;

// Unspecified, loopback, unique local, and link-local IPv6.
const PRIVATE_IPV6 = /^\[(::1?\]|f[cd][0-9a-f]{0,2}:|fe[89ab][0-9a-f]?:)/;
const MAPPED_IPV4 = /^\[::ffff:([0-9a-f]{1,4}):([0-9a-f]{1,4})\]$/;

function mappedIPv4(hostname: string): string {
  const [, high, low] = MAPPED_IPV4.exec(hostname) ?? [];
  if (!high || !low) return hostname;

  const first = Number.parseInt(high, 16);
  const second = Number.parseInt(low, 16);
  return [first >> 8, first & 255, second >> 8, second & 255].join('.');
}

function isPrivateHost(hostname: string): boolean {
  return (
    LOCAL_HOSTS.has(hostname) ||
    hostname.endsWith('.localhost') ||
    hostname.endsWith('.local') ||
    PRIVATE_IPV4.test(hostname) ||
    PRIVATE_IPV6.test(hostname)
  );
}

function parseUrl(uri: string): URL | null {
  try {
    return new URL(uri);
  } catch {
    return null;
  }
}

function isSafe(uri: string): boolean {
  const url = parseUrl(uri);
  if (!url) return false;

  return (
    url.protocol === 'https:' &&
    !isPrivateHost(mappedIPv4(url.hostname.replace(/\.$/, '')))
  );
}

/**
 * Redirect URIs, one per line, that are not a public `https://` address:
 * custom schemes, `http://`, loopback, private-network, and link-local hosts,
 * and the out-of-band URI. Each URI is listed once.
 */
export function unsafeRedirectUris(redirects: string): ReadonlyArray<string> {
  const lines = redirects.split('\n').map((line) => line.trim());

  return [...new Set(lines.filter(Boolean).filter((uri) => !isSafe(uri)))];
}
