import { redirect } from '@sveltejs/kit';

export function load({ url }: { url: URL }): void {
  if (url.searchParams.get('section') === 'apps') redirect(307, '/apps');
}
