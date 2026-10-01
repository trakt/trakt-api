import type { PageMeta } from './pageMeta.ts';
import type { PageMetaTag } from './PageMetaTag.ts';

function metaTag(
  name: 'name' | 'property',
  value: string,
  content: string,
): PageMetaTag {
  return {
    element: 'meta',
    key: { name, value },
    attribute: 'content',
    value: content,
  };
}

const CANONICAL_KEY = { name: 'rel', value: 'canonical' };

const ROBOTS_KEY = { name: 'name', value: 'robots' };

export function pageMetaTags(meta: PageMeta): ReadonlyArray<PageMetaTag> {
  const indexing: PageMetaTag = meta.indexable
    ? {
      element: 'link',
      key: CANONICAL_KEY,
      attribute: 'href',
      value: meta.canonical,
    }
    : metaTag('name', ROBOTS_KEY.value, 'noindex');

  return [
    metaTag('name', 'description', meta.description),
    indexing,
    metaTag('property', 'og:url', meta.canonical),
    metaTag('property', 'og:title', meta.title),
    metaTag('property', 'og:description', meta.description),
  ];
}
