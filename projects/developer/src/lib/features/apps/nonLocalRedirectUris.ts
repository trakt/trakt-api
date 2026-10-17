import { isLoopbackRedirect } from './isLoopbackRedirect.ts';

export function nonLocalRedirectUris(redirects: string): ReadonlyArray<string> {
  const lines = redirects.split('\n').map((line) => line.trim());
  return [
    ...new Set(lines.filter(Boolean).filter((uri) => !isLoopbackRedirect(uri))),
  ];
}
