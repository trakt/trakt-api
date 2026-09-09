import { describe, expect, it } from 'vitest';
import { tokenizeJson } from './tokenizeJson.ts';

describe('tokenizeJson', () => {
  it('should preserve JSON while classifying its values', () => {
    const json =
      '{\n  "title": "TRON",\n  "year": 1982,\n  "vip": true,\n  "note": null\n}';
    const tokens = tokenizeJson(json);

    expect(tokens.map(({ value }) => value).join('')).toBe(json);
    expect(tokens).toEqual(expect.arrayContaining([
      { type: 'key', value: '"title"' },
      { type: 'string', value: '"TRON"' },
      { type: 'number', value: '1982' },
      { type: 'boolean', value: 'true' },
      { type: 'null', value: 'null' },
    ]));
  });

  it('should treat escaped quotes as part of a string', () => {
    const json = '{"message":"Say \\"hello\\""}';

    expect(tokenizeJson(json)).toEqual([
      { type: 'plain', value: '{' },
      { type: 'key', value: '"message"' },
      { type: 'plain', value: ':' },
      { type: 'string', value: '"Say \\"hello\\""' },
      { type: 'plain', value: '}' },
    ]);
  });
});
