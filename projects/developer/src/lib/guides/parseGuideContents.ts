type GuideGroup = {
  title: string;
  items: Array<{ title: string; slug: string }>;
};

export function parseGuideContents(markdown: string): Array<GuideGroup> {
  const groups: Array<GuideGroup> = [];
  for (const line of markdown.split('\n')) {
    const heading = /^##\s+(.+)$/.exec(line);
    if (heading) {
      groups.push({ title: heading[1], items: [] });
      continue;
    }

    const link = /^- \[([^\]]+)\]\(\/\?section=guides&guide=([\w-]+)\)/.exec(
      line,
    );
    if (!link) continue;
    if (groups.length === 0) groups.push({ title: 'Guides', items: [] });
    groups.at(-1)!.items.push({ title: link[1], slug: link[2] });
  }

  return groups.filter((group) => group.items.length > 0);
}
