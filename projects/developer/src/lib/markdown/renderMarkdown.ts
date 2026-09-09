import { Marked } from 'marked';

function escapeHtml(value: string): string {
  return value.replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;');
}

function safeHref(value: string): string | null {
  if (
    value.startsWith('#') || value.startsWith('/') ||
    value.startsWith('./') || value.startsWith('../')
  ) {
    return value;
  }

  try {
    const url = new URL(value);
    return ['https:', 'http:', 'mailto:'].includes(url.protocol) ? value : null;
  } catch {
    return null;
  }
}

const markdown = new Marked({
  gfm: true,
  renderer: {
    html({ text }) {
      return escapeHtml(text);
    },
    image({ text }) {
      return escapeHtml(text);
    },
    link({ href, title, tokens }) {
      const label = this.parser.parseInline(tokens);
      const safeUrl = safeHref(href);
      if (!safeUrl) return label;

      const titleAttribute = title ? ` title="${escapeHtml(title)}"` : '';
      const externalAttributes = safeUrl.startsWith('http')
        ? ' target="_blank" rel="noreferrer"'
        : '';

      return `<a href="${
        escapeHtml(safeUrl)
      }"${titleAttribute}${externalAttributes}>${label}</a>`;
    },
  },
});

export function renderMarkdown(value: string): string {
  return markdown.parse(value, { async: false, gfm: true });
}
