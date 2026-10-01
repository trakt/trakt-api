export function renderSitemap(
  pages: ReadonlyArray<{ url: string; lastModified?: string }>,
): string {
  const entries = pages.map(({ url, lastModified }) =>
    [
      '  <url>',
      `    <loc>${url}</loc>`,
      ...(lastModified ? [`    <lastmod>${lastModified}</lastmod>`] : []),
      '  </url>',
    ].join('\n')
  );

  return [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
    ...entries,
    '</urlset>',
    '',
  ].join('\n');
}
