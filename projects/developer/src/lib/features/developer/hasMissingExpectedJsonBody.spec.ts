import { describe, expect, it } from 'vitest';
import { seedCatalog } from '$lib/openapi/seedCatalog.ts';
import { hasMissingExpectedJsonBody } from './hasMissingExpectedJsonBody.ts';

describe('hasMissingExpectedJsonBody', () => {
  const endpoint = seedCatalog.endpoints.find(({ requestBody }) =>
    requestBody?.contentType === 'application/json'
  );

  if (!endpoint) throw new Error('Missing seed endpoint with a JSON body.');

  it('should report an empty expected JSON body', () => {
    expect(hasMissingExpectedJsonBody({ endpoint, body: '   ' })).toBe(true);
  });

  it('should accept a provided JSON body', () => {
    expect(hasMissingExpectedJsonBody({ endpoint, body: '{}' })).toBe(false);
  });

  it('should ignore endpoints without a JSON request body', () => {
    const endpointWithoutBody = seedCatalog.endpoints.find(({ requestBody }) =>
      requestBody === null
    );
    if (!endpointWithoutBody) {
      throw new Error('Missing seed endpoint without a body.');
    }

    expect(
      hasMissingExpectedJsonBody({ endpoint: endpointWithoutBody, body: '' }),
    ).toBe(false);
  });
});
