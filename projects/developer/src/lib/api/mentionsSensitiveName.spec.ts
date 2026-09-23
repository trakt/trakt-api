import { describe, expect, it } from 'vitest';
import { mentionsSensitiveName } from './mentionsSensitiveName.ts';

describe('mentionsSensitiveName', () => {
  it('finds a credential name anywhere in free text', () => {
    expect(mentionsSensitiveName('api_key=abc&title=TRON')).toBe(true);
    expect(mentionsSensitiveName('Set-Cookie: session=1')).toBe(true);
    expect(mentionsSensitiveName('Access Token: abc')).toBe(true);
  });

  it('ignores text without credential names', () => {
    expect(mentionsSensitiveName('<p>TRON: Legacy</p>')).toBe(false);
  });
});
