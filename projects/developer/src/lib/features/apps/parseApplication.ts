import type { ApplicationInput } from './ApplicationInput.ts';
import { splitLines } from './splitLines.ts';
import { unsafeRedirectUris } from './unsafeRedirectUris.ts';

const DANGEROUS_REDIRECT_SCHEMES: ReadonlySet<string> = new Set([
  'javascript:',
  'data:',
  'vbscript:',
  'blob:',
]);

export function parseApplication({
  name,
  description,
  redirects,
  originsText,
  dev = false,
  enforceProductionRedirects = false,
  redirectsOptional = false,
}: {
  name: string;
  description: string;
  redirects: string;
  originsText: string;
  dev?: boolean;
  enforceProductionRedirects?: boolean;
  /** Production apps without browser sign-in can have an empty redirect list. */
  redirectsOptional?: boolean;
}): ApplicationInput {
  const redirect_uri = splitLines(redirects);
  const origins = splitLines(originsText);

  if (!name.trim() || name.trim().length > 255) {
    throw new Error('Enter an app name of 1-255 characters.');
  }
  if (description.trim().length > 255) {
    throw new Error('Keep the description within 255 characters.');
  }
  if (
    (!redirect_uri.length && !redirectsOptional) ||
    redirect_uri.length > 25 ||
    redirect_uri.join('\n').length > 2048
  ) {
    throw new Error(
      'Enter 1-25 redirect URIs, within 2,048 characters in total.',
    );
  }

  for (const uri of redirect_uri) {
    if (uri === 'urn:ietf:wg:oauth:2.0:oob') continue;
    let url: URL;
    try {
      url = new URL(uri);
    } catch {
      throw new Error('Enter valid redirect URIs, one per line.');
    }
    if (
      DANGEROUS_REDIRECT_SCHEMES.has(url.protocol) ||
      (!dev && !uri.toLowerCase().startsWith(`${url.protocol}//`))
    ) {
      throw new Error('Enter valid redirect URIs, one per line.');
    }
    if (url.search || url.hash) {
      throw new Error('Redirect URIs cannot contain queries or fragments.');
    }
  }

  const blocked = enforceProductionRedirects
    ? unsafeRedirectUris(redirects)
    : [];
  if (blocked.length > 0) {
    throw new Error(
      `Production redirect URIs must use https:// on a domain you control. Change ${blocked.join(', ')}.`,
    );
  }

  const canonical = origins.map((origin) => {
    let url: URL;
    try {
      url = new URL(origin);
    } catch {
      throw new Error('Enter valid HTTP or HTTPS origins, one per line.');
    }
    if (
      origin.includes('*') ||
      !['http:', 'https:'].includes(url.protocol) ||
      url.pathname !== '/' ||
      url.search ||
      url.hash ||
      url.username ||
      url.password
    ) {
      throw new Error(
        'Origins must be HTTP or HTTPS URLs without paths, credentials, queries, fragments, or wildcards.',
      );
    }
    return url.origin;
  });
  if (canonical.length > 25 || canonical.join(' ').length > 255) {
    throw new Error('Enter up to 25 origins, within 255 characters in total.');
  }

  return {
    name: name.trim(),
    description: description.trim() || undefined,
    redirect_uri,
    origins: canonical,
    dev,
  };
}
