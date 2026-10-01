const MAX_LENGTH = 160;

function plainText(markdown: string): string {
  return markdown
    .replace(/!\[[^\]]*\]\([^)]*\)/g, '')
    .replace(/\[([^\]]+)\]\([^)]*\)/g, '$1')
    .replace(/[*_`]/g, '')
    .replace(/\s+/g, ' ')
    .trim();
}

function truncate(text: string): string {
  if (text.length <= MAX_LENGTH) return text;

  const cut = text.slice(0, MAX_LENGTH - 1);
  const end = cut.lastIndexOf(' ');

  return `${(end > 0 ? cut.slice(0, end) : cut).replace(/[\s,.;:-]+$/, '')}…`;
}

export function guideDescription(source: string): string | null {
  const body = source.replace(/^---\r?\n[\s\S]*?\r?\n---\r?\n/, '');
  const paragraph = body
    .split(/\r?\n\s*\r?\n/)
    .map((block) => block.trim())
    .find((block) => block !== '' && !/^[#>|`<\-*\d!]/.test(block));

  if (!paragraph) return null;

  const text = plainText(paragraph);

  return text ? truncate(text) : null;
}
