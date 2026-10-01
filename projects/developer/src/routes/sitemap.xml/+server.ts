import { GUIDE_SOURCES } from '$lib/guides/GUIDE_SOURCES.ts';
import { GUIDES } from '$lib/guides/GUIDES.ts';
import { guidePath } from '$lib/guides/guidePath.ts';
import { guideUpdatedAt } from '$lib/guides/guideUpdatedAt.ts';
import { renderSitemap } from '$lib/seo/renderSitemap.ts';
import { SITE_ORIGIN } from '$lib/seo/SITE_ORIGIN.ts';

export const prerender = true;

export function GET(): Response {
  const guides = GUIDES.map(({ slug }) => ({
    url: `${SITE_ORIGIN}${guidePath(slug)}`,
    lastModified: guideUpdatedAt(GUIDE_SOURCES.get(slug) ?? '')?.datetime,
  }));

  return new Response(
    renderSitemap([{ url: `${SITE_ORIGIN}/` }, ...guides]),
    { headers: { 'Content-Type': 'application/xml' } },
  );
}
