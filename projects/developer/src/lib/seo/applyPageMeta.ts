import { PAGE_META_KEYS } from './PAGE_META_KEYS.ts';
import type { PageMeta } from './pageMeta.ts';
import { pageMetaTags } from './pageMetaTags.ts';

type PageMetaDocument = Pick<Document, 'head' | 'createElement'>;

function selector({ name, value }: { name: string; value: string }): string {
  return `[${name}="${value}"]`;
}

export function applyPageMeta(
  { document, meta }: { document: PageMetaDocument; meta: PageMeta },
): void {
  const tags = pageMetaTags(meta);

  for (const key of PAGE_META_KEYS) {
    const existing = document.head.querySelector(selector(key));
    const tag = tags.find((candidate) =>
      candidate.key.name === key.name && candidate.key.value === key.value
    );

    if (!tag) {
      existing?.remove();
      continue;
    }

    const element = existing ?? document.createElement(tag.element);

    element.setAttribute(key.name, key.value);
    element.setAttribute(tag.attribute, tag.value);
    if (!existing) document.head.append(element);
  }
}
