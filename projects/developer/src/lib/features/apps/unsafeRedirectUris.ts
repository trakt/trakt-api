const LOCAL_HOSTS: ReadonlySet<string> = new Set(['localhost', '0.0.0.0']);

// Loopback, private (RFC 1918), and link-local IPv4 ranges.
const PRIVATE_IPV4 =
  /^(127\.|10\.|192\.168\.|169\.254\.|172\.(1[6-9]|2\d|3[01])\.)/;

// Loopback, unique local (fc00::/7), and link-local (fe80::/10) IPv6.
const PRIVATE_IPV6 = /^\[(::1|f[cd][0-9a-f]{0,2}:|fe[89ab][0-9a-f]?:)/;

function isPrivateHost(hostname: string): boolean {
  return LOCAL_HOSTS.has(hostname) || hostname.endsWith('.localhost') ||
    hostname.endsWith('.local') || PRIVATE_IPV4.test(hostname) ||
    PRIVATE_IPV6.test(hostname);
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

  return url.protocol === 'https:' && !isPrivateHost(url.hostname);
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
