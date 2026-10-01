import { guidePath } from '$lib/guides/guidePath.ts';

export function legacyGuideQueryDestination(url: URL): string | null {
  if (url.searchParams.get('section') !== 'guides') return null;

  const guide = url.searchParams.get('guide');
  if (!guide || !/^[\w-]+$/.test(guide)) return null;

  return guidePath(guide);
}
