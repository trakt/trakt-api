const files = import.meta.glob<string>('/src/lib/guides/*.md', {
  query: '?raw',
  import: 'default',
  eager: true,
});

export const GUIDE_SOURCES: ReadonlyMap<string, string> = new Map(
  Object.entries(files).map(([path, markdown]) => [
    (path.split('/').at(-1) ?? path).replace(/\.md$/, ''),
    markdown,
  ]),
);
