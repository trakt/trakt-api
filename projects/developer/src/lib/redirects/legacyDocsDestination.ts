import guideRedirects from './guideRedirects.json' with { type: 'json' };

const GUIDES: ReadonlyMap<string, string> = new Map(
  Object.entries(guideRedirects),
);

export function legacyDocsDestination(pathname: string): string {
  const path = pathname.replace(/\/+$/, '').replace(/\.md$/, '');
  const guide = GUIDES.get(path);

  if (guide) return `/?section=guides&guide=${guide}`;
  if (path === '/docs') return '/?section=guides';

  return '/';
}
