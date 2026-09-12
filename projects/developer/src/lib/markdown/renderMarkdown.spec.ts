import { describe, expect, it } from 'vitest';
import { renderMarkdown } from './renderMarkdown.ts';

describe('renderMarkdown', () => {
  it('should render headings, emphasis, code, and tables', () => {
    const result = renderMarkdown(`
#### Details

Use **full** with \`extended\`.

| Key | Value |
|---|---|
| mode | full |
`);

    expect(result).toContain('<h4>Details</h4>');
    expect(result).toContain('<strong>full</strong>');
    expect(result).toContain('<code>extended</code>');
    expect(result).toContain('<table>');
  });

  it('should escape raw HTML and reject executable links', () => {
    const result = renderMarkdown(
      '<script>alert(1)</script>\n\n[unsafe](javascript:alert(1))',
    );

    expect(result).toContain('&lt;script&gt;');
    expect(result).not.toContain('<script>');
    expect(result).not.toContain('href="javascript:');
  });

  it('should harden external links', () => {
    const result = renderMarkdown('[Trakt](https://trakt.tv)');

    expect(result).toContain('href="https://trakt.tv"');
    expect(result).toContain('target="_blank" rel="noreferrer"');
  });

  it('should preserve support email links', () => {
    const result = renderMarkdown(
      '[email Trakt support](mailto:support@trakt.tv)',
    );

    expect(result).toContain(
      '<a href="mailto:support@trakt.tv">email Trakt support</a>',
    );
    expect(result).not.toContain('target="_blank"');
  });

  it('should escape attributes in email links', () => {
    const result = renderMarkdown(
      '[support](mailto:support@trakt.tv?subject=Help&body=Details)',
    );

    expect(result).toContain(
      'href="mailto:support@trakt.tv?subject=Help&amp;body=Details"',
    );
  });
});
