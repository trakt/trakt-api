import { describe, expect, it } from 'vitest';
import { seedCatalog } from '$lib/openapi/seedCatalog.ts';
import {
  hasMissingRequiredParameters,
  missingRequiredParameterIds,
} from './hasMissingRequiredParameters.ts';

describe('hasMissingRequiredParameters', () => {
  it('should report an empty required path parameter', () => {
    const endpoint = seedCatalog.endpoints.at(0);
    if (!endpoint) throw new Error('Missing seed endpoint.');

    expect(hasMissingRequiredParameters({
      endpoint,
      values: { 'path:id': '   ' },
      headers: [],
    })).toBe(true);
  });

  it('should return missing parameters in document order', () => {
    const endpoint = seedCatalog.endpoints.at(0);
    if (!endpoint) throw new Error('Missing seed endpoint.');

    expect(missingRequiredParameterIds({ endpoint, values: {}, headers: [] }))
      .toEqual(
        endpoint.parameters.filter(({ required }) => required).map(({ id }) =>
          id
        ),
      );
  });

  it('should accept supplied required parameters', () => {
    const seedEndpoint = seedCatalog.endpoints.at(0);
    if (!seedEndpoint) throw new Error('Missing seed endpoint.');

    const endpoint = {
      ...seedEndpoint,
      parameters: [
        ...seedEndpoint.parameters,
        {
          id: 'header:content-type',
          name: 'Content-Type',
          location: 'header' as const,
          required: true,
          description: 'Request content type.',
          type: 'string',
          enumValues: [],
          defaultValue: '',
        },
      ],
    };

    expect(hasMissingRequiredParameters({
      endpoint,
      values: { 'path:id': 'tron-legacy-2010' },
      headers: [{
        id: 'parameter:header:content-type',
        name: 'Content-Type',
        value: 'application/json',
        enabled: true,
      }],
    })).toBe(false);
  });
});
