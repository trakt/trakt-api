import type { ApplicationInput } from './applications.ts';
const lines = (value: string) =>
  value.split('\n').map((line) => line.trim()).filter(Boolean);
export function parseApplication(
  name: string,
  description: string,
  redirects: string,
  originsText: string,
): ApplicationInput {
  const redirect_uri = lines(redirects);
  const origins = lines(originsText);
  if (!name.trim() || name.trim().length > 255) {
    throw new Error('Enter an app name of 1–255 characters.');
  }
  if (description.trim().length > 255) {
    throw new Error('Keep the description within 255 characters.');
  }
  if (
    !redirect_uri.length || redirect_uri.length > 25 ||
    redirect_uri.join('\n').length > 2048
  ) {
    throw new Error(
      'Enter 1–25 redirect URIs, within 2,048 characters in total.',
    );
  }
  for (const uri of redirect_uri) {
    if (uri === 'urn:ietf:wg:oauth:2.0:oob') continue;
    let url;
    try {
      url = new URL(uri);
    } catch {
      throw new Error('Enter valid redirect URIs, one per line.');
    }
    if (
      url.search || url.hash ||
      !uri.toLowerCase().startsWith(`${url.protocol}//`)
    ) {
      throw new Error(
        'Redirect URIs must use a URL scheme and cannot contain queries or fragments.',
      );
    }
  }
  const canonical = origins.map((origin) => {
    let url;
    try {
      url = new URL(origin);
    } catch {
      throw new Error('Enter valid HTTP or HTTPS origins, one per line.');
    }
    if (
      origin.includes('*') || !['http:', 'https:'].includes(url.protocol) ||
      url.pathname !== '/' || url.search || url.hash || url.username ||
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
  };
}
