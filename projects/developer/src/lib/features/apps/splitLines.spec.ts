import { describe, expect, it } from 'vitest';
import { splitLines } from './splitLines.ts';

describe('splitLines', () => {
  it('trims each line and drops blank ones', () => {
    expect(splitLines(' https://a.example \n\n https://b.example')).toEqual([
      'https://a.example',
      'https://b.example',
    ]);
  });
});
