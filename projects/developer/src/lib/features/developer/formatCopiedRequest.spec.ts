import { describe, expect, it } from 'vitest';
import { formatCurlRequest, formatRequestLine } from './formatCopiedRequest.ts';

describe('formatRequestLine', () => {
  it('should format the method and URL', () => {
    expect(formatRequestLine({
      method: 'GET',
      url: 'https://api.trakt.tv/movies/{id}',
    })).toBe('GET https://api.trakt.tv/movies/{id}');
  });

  it('should redact sensitive URL parameters', () => {
    expect(formatRequestLine({
      method: 'GET',
      url: 'https://api.trakt.tv/example?access_token=secret&extended=full',
    })).toBe(
      'GET https://api.trakt.tv/example?access_token=%5BREDACTED%5D&extended=full',
    );
  });
});

describe('formatCurlRequest', () => {
  it.each(['POST', 'PUT', 'GET'] as const)(
    'should redact client IDs in copied %s requests',
    (method) => {
      const url = 'https://auth.trakt.tv/oauth/token?client_id=query-client-id';
      const result = formatCurlRequest({
        method,
        url,
        headers: [{
          id: 'client',
          name: 'Client-Id',
          value: 'header-client-id',
          enabled: true,
        }],
        body: JSON.stringify({
          client_id: 'body-client-id',
          nested: [{ clientId: 'nested-client-id' }],
          title: 'TRON',
        }),
      });

      expect(result).not.toMatch(
        /query-client-id|header-client-id|body-client-id|nested-client-id/,
      );
      expect(result).toContain('"client_id":"[REDACTED]"');
      expect(result).toContain('"clientId":"[REDACTED]"');
      expect(result).toContain('"title":"TRON"');
      expect(formatRequestLine({ method, url })).not.toContain(
        'query-client-id',
      );
    },
  );

  it('should redact OAuth credentials in nested JSON objects and arrays', () => {
    const result = formatCurlRequest({
      method: 'POST',
      url: 'https://auth.trakt.tv/oauth/token',
      headers: [],
      body: JSON.stringify({
        client_secret: 'private-client-secret',
        grant_type: 'refresh_token',
        accounts: [{
          access_token: 'private-access-token',
          refresh_token: 'private-refresh-token',
        }],
      }),
    });

    expect(result).not.toContain('private-');
    expect(result).toContain('"client_secret":"[REDACTED]"');
    expect(result).toContain('"access_token":"[REDACTED]"');
    expect(result).toContain('"refresh_token":"[REDACTED]"');
    expect(result).toContain('"grant_type":"refresh_token"');
  });

  it('should omit bodies that cannot be safely parsed for redaction', () => {
    const result = formatCurlRequest({
      method: 'POST',
      url: 'https://auth.trakt.tv/oauth/revoke',
      headers: [],
      body: '{"token":"private-token",',
    });

    expect(result).toContain("--data '[REDACTED]'");
    expect(result).not.toContain('private-token');
  });

  it('should include enabled headers and the JSON body while redacting secrets', () => {
    const result = formatCurlRequest({
      method: 'POST',
      url: 'https://api.trakt.tv/checkin',
      headers: [
        {
          id: 'accept',
          name: 'Accept',
          value: 'application/json',
          enabled: true,
        },
        { id: 'key', name: 'trakt-api-key', value: 'secret', enabled: true },
        {
          id: 'auth',
          name: 'Authorization',
          value: 'Bearer token',
          enabled: true,
        },
        { id: 'off', name: 'X-Debug', value: 'hidden', enabled: false },
      ],
      body: '{"movie":{"ids":{"trakt":1}}}',
    });

    expect(result).toContain("--header 'Accept: application/json'");
    expect(result).toContain("--header 'trakt-api-key: [REDACTED]'");
    expect(result).toContain("--header 'Authorization: Bearer [REDACTED]'");
    expect(result).toContain("--header 'content-type: application/json'");
    expect(result).toContain('--data \'{"movie":{"ids":{"trakt":1}}}\'');
    expect(result).not.toContain('secret');
    expect(result).not.toContain('Bearer token');
    expect(result).not.toContain('X-Debug');
  });

  it('should safely quote apostrophes for the shell', () => {
    expect(formatCurlRequest({
      method: 'POST',
      url: 'https://api.trakt.tv/checkin',
      headers: [],
      body: '{"message":"it\'s ready"}',
    })).toContain(`--data '{"message":"it'"'"'s ready"}'`);
  });
});
