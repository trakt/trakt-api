import { GUIDES } from '$lib/guides/GUIDES.ts';
import { legacyDocsDestination } from '$lib/redirects/legacyDocsDestination.ts';
import { redirect } from '@sveltejs/kit';
import type { EntryGenerator, PageLoad } from './$types';

export const ssr = true;

export const entries: EntryGenerator = () =>
  GUIDES.map(({ slug }) => ({ slug }));

export const load: PageLoad = ({ params, url }) => {
  if (GUIDES.some(({ slug }) => slug === params.slug)) return;

  redirect(301, legacyDocsDestination(url.pathname));
};
