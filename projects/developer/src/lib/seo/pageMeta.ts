import { GUIDE_SOURCES } from '$lib/guides/GUIDE_SOURCES.ts';
import { GUIDES } from '$lib/guides/GUIDES.ts';
import { guideDescription } from '$lib/guides/guideDescription.ts';
import { guidePath } from '$lib/guides/guidePath.ts';
import { SITE_ORIGIN } from './SITE_ORIGIN.ts';

export type PageMeta = {
  title: string;
  description: string;
  canonical: string;
  indexable: boolean;
};

const SITE_NAME = 'Trakt Developer';

const HOME: PageMeta = {
  title: `${SITE_NAME} | API guides, reference, and playground`,
  description:
    'Official developer portal for the Trakt API. Read the guides, browse every endpoint, and run authenticated requests straight from your browser.',
  canonical: `${SITE_ORIGIN}/`,
  indexable: true,
};

function guideMeta(pathname: string): PageMeta | null {
  const guide = GUIDES.find(({ slug }) => guidePath(slug) === pathname);
  if (!guide) return null;

  const source = GUIDE_SOURCES.get(guide.slug) ?? '';

  return {
    title: `${guide.title} | Trakt API Guides`,
    description: guideDescription(source) ?? HOME.description,
    canonical: `${SITE_ORIGIN}${pathname}`,
    indexable: true,
  };
}

const PREMIUM: PageMeta = {
  title: `Premium | ${SITE_NAME}`,
  description:
    'Compare the Standard and Premium tiers of the Trakt API: higher rate limits, more endpoints, apiz.trakt.tv, and apps that stay outside the community app limit.',
  canonical: `${SITE_ORIGIN}/premium`,
  indexable: true,
};

export function pageMeta(pathname: string): PageMeta {
  const guide = guideMeta(pathname);
  if (guide) return guide;

  if (pathname === '/') return HOME;
  if (pathname === '/premium') return PREMIUM;

  return { ...HOME, indexable: false };
}
