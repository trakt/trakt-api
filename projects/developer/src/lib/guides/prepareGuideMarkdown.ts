import { operationLink } from '../features/developer/operationLink.ts';

export function prepareGuideMarkdown(
  source: string,
  slugs: ReadonlySet<string>,
  operationIds: ReadonlyArray<string> = [],
): string {
  const operations = new Map(operationIds.map((id) => [id.toLowerCase(), id]));
  return source
    .replace(/^---\n[\s\S]*?\n---\n\s*/, '')
    .replace(/^Fetch the complete documentation index at:[^\n]*\n\s*/, '')
    .replace(
      /\]\((?:https:\/\/docs\.trakt\.tv)?\/docs\/([\w-]+)(?:\.md)?\)/g,
      (_, originalSlug: string) => {
        const slug = originalSlug === 'caching-and-fresh-metadata'
          ? 'caching-and-fresh-data'
          : originalSlug;
        return slugs.has(slug)
          ? `](/?section=guides&guide=${slug})`
          : `](https://docs.trakt.tv/docs/${originalSlug})`;
      },
    )
    .replace(
      /\]\(#reference\/([\w-]+)\)/g,
      '](https://docs.trakt.tv/reference/$1)',
    )
    .replace(
      /\]\((?:https:\/\/docs\.trakt\.tv)?\/reference\/([\w-]+)\)/g,
      (link: string, slug: string) => {
        const operationId = operations.get(slug.toLowerCase());
        return operationId ? `](${operationLink(operationId)})` : link;
      },
    );
}
