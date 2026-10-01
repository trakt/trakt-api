import { legacyGuideQueryDestination } from '$lib/redirects/legacyGuideQueryDestination.ts';
import { redirect } from '@sveltejs/kit';

export function load({ url }: { url: URL }): void {
  if (url.searchParams.get('section') === 'apps') redirect(307, '/apps');

  const guide = legacyGuideQueryDestination(url);
  if (guide) redirect(301, guide);
}
