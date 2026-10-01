import type { PageMeta } from './pageMeta.ts';
import { pageMetaTags } from './pageMetaTags.ts';

function escapeAttribute(value: string): string {
  return value
    .replaceAll('&', '&amp;')
    .replaceAll('"', '&quot;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;');
}

export function renderPageMeta(meta: PageMeta): string {
  const tags = pageMetaTags(meta).map(({ element, key, attribute, value }) =>
    `<${element} ${key.name}="${key.value}" ${attribute}="${
      escapeAttribute(value)
    }" />`
  );

  return [`<title>${escapeAttribute(meta.title)}</title>`, ...tags]
    .join('\n    ');
}
