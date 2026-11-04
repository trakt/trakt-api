export function splitLinks(text: string): string[] {
  const links = text
    .split(/[,\n]/)
    .map((link) => link.trim())
    .filter(Boolean);

  return [...new Set(links)];
}
