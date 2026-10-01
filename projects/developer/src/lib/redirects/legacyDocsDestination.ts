import { guidePath } from '$lib/guides/guidePath.ts';
import guideRedirects from './guideRedirects.json' with { type: 'json' };

const GUIDES: ReadonlyMap<string, string> = new Map(
  Object.entries(guideRedirects),
);

export function legacyDocsDestination(pathname: string): string {
  const path = pathname.replace(/\/+$/, '').replace(/\.md$/, '');
  const guide = GUIDES.get(path);

  if (guide) return guidePath(guide);
  if (path === '/docs') return guidePath('getting-started');

  return '/';
}
