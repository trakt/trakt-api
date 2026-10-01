import { pageMeta } from '$lib/seo/pageMeta.ts';
import { renderPageMeta } from '$lib/seo/renderPageMeta.ts';
import type { Handle } from '@sveltejs/kit';

const META_TOKEN = '%trakt.meta%';

export const handle: Handle = ({ event, resolve }) => {
  const meta = renderPageMeta(pageMeta(event.url.pathname));

  return resolve(event, {
    transformPageChunk: ({ html }) => html.replace(META_TOKEN, meta),
  });
};
