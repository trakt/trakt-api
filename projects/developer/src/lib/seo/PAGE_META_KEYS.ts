import type { PageMetaTag } from './PageMetaTag.ts';

export const PAGE_META_KEYS: ReadonlyArray<PageMetaTag['key']> = [
  { name: 'name', value: 'description' },
  { name: 'rel', value: 'canonical' },
  { name: 'name', value: 'robots' },
  { name: 'property', value: 'og:url' },
  { name: 'property', value: 'og:title' },
  { name: 'property', value: 'og:description' },
];
