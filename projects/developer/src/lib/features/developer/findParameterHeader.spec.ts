import { describe, expect, it } from 'vitest';
import { findParameterHeader } from './findParameterHeader.ts';

const parameter = {
  id: 'header:content-type',
  name: 'Content-Type',
  location: 'header' as const,
  required: true,
  description: 'Request content type.',
  type: 'string',
  enumValues: [],
  defaultValue: '',
};

describe('findParameterHeader', () => {
  it('finds the header matching the parameter', () => {
    const header = {
      id: 'parameter:header:content-type',
      name: 'Content-Type',
      value: 'application/json',
      enabled: true,
    };

    expect(findParameterHeader({ parameter, headers: [header] })).toBe(
      header,
    );
  });

  it('returns undefined when no header matches the parameter', () => {
    expect(findParameterHeader({ parameter, headers: [] })).toBeUndefined();
  });
});
