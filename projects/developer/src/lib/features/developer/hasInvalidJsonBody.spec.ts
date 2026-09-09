import { describe, expect, it } from 'vitest';
import type { Endpoint } from '$lib/openapi/Endpoint.ts';
import { seedCatalog } from '$lib/openapi/seedCatalog.ts';
import { hasInvalidJsonBody } from './hasInvalidJsonBody.ts';

describe('hasInvalidJsonBody', () => {
  const postEndpoint = seedCatalog.endpoints.find(({ method, requestBody }) =>
    method === 'POST' && requestBody?.contentType === 'application/json'
  );

  if (!postEndpoint) {
    throw new Error('Missing seed POST endpoint with a JSON body.');
  }

  it('should reject malformed JSON for POST requests', () => {
    expect(hasInvalidJsonBody({ endpoint: postEndpoint, body: '{"id":}' }))
      .toBe(true);
  });

  it('should accept valid JSON for POST requests', () => {
    expect(hasInvalidJsonBody({ endpoint: postEndpoint, body: '{"id":1}' }))
      .toBe(false);
  });

  it('should leave empty-body validation to the required-body rule', () => {
    expect(hasInvalidJsonBody({ endpoint: postEndpoint, body: '  ' }))
      .toBe(false);
  });

  it.each(['PUT', 'PATCH', 'DELETE'] as const)(
    'should validate documented JSON bodies for %s requests',
    (method) => {
      const endpoint: Endpoint = { ...postEndpoint, method };

      expect(hasInvalidJsonBody({ endpoint, body: '{"id":}' })).toBe(true);
      expect(hasInvalidJsonBody({ endpoint, body: '{"id":1}' })).toBe(false);
    },
  );

  it('should not apply when no request body is documented', () => {
    const endpoint: Endpoint = { ...postEndpoint, requestBody: null };
    expect(hasInvalidJsonBody({ endpoint, body: '{"id":}' }))
      .toBe(false);
  });

  it('should not parse non-JSON request bodies', () => {
    const endpoint: Endpoint = {
      ...postEndpoint,
      requestBody: { ...postEndpoint.requestBody!, contentType: 'text/plain' },
    };

    expect(hasInvalidJsonBody({ endpoint, body: '{"id":}' }))
      .toBe(false);
  });
});
