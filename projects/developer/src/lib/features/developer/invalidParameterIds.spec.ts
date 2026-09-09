import { describe, expect, it } from 'vitest';
import type { Endpoint } from '$lib/openapi/Endpoint.ts';
import { seedCatalog } from '$lib/openapi/seedCatalog.ts';
import {
  hasInvalidParameterValues,
  invalidParameterIds,
} from './invalidParameterIds.ts';

const baseEndpoint = seedCatalog.endpoints.at(0);
if (!baseEndpoint) throw new Error('Missing seed endpoint.');

const endpoint: Endpoint = {
  ...baseEndpoint,
  parameters: [
    {
      id: 'query:page',
      name: 'page',
      location: 'query',
      required: false,
      description: 'Page number.',
      type: 'integer',
      enumValues: [],
      defaultValue: '',
    },
    {
      id: 'query:enabled',
      name: 'enabled',
      location: 'query',
      required: false,
      description: 'Whether the feature is enabled.',
      type: 'boolean',
      enumValues: [],
      defaultValue: '',
    },
  ],
};

describe('invalidParameterIds', () => {
  it('should reject decimal and non-numeric integer values', () => {
    expect(invalidParameterIds({
      endpoint,
      values: { 'query:page': '1.5', 'query:enabled': 'true' },
      headers: [],
    })).toEqual(['query:page']);

    expect(hasInvalidParameterValues({
      endpoint,
      values: { 'query:page': 'many', 'query:enabled': 'true' },
      headers: [],
    })).toBe(true);
  });

  it('should accept signed integers without converting their precision', () => {
    expect(invalidParameterIds({
      endpoint,
      values: {
        'query:page': '-9223372036854775808',
        'query:enabled': 'false',
      },
      headers: [],
    })).toEqual([]);
  });

  it('should allow an optional integer to remain empty', () => {
    expect(invalidParameterIds({ endpoint, values: {}, headers: [] })).toEqual(
      [],
    );
  });

  it('should reject boolean values outside true and false', () => {
    expect(invalidParameterIds({
      endpoint,
      values: { 'query:enabled': 'yes' },
      headers: [],
    })).toEqual(['query:enabled']);
  });
});
