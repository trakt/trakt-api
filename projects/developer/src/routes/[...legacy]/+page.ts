import { legacyDocsDestination } from '$lib/redirects/legacyDocsDestination.ts';
import { redirect } from '@sveltejs/kit';
import type { PageLoad } from './$types';

export const prerender = false;

export const load: PageLoad = ({ url }) => {
  redirect(301, legacyDocsDestination(url.pathname));
};
