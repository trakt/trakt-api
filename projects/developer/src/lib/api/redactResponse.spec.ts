import { describe, expect, it } from 'vitest';
import { redactResponse } from './redactResponse.ts';

describe('redactResponse', () => {
  it.each(['client_id', 'client-id', 'clientId'])(
    'should redact %s from response output',
    (name) => {
      const result = redactResponse({
        body: JSON.stringify({ [name]: 'body-id', title: 'TRON' }),
        isJson: true,
        headers: [
          { name, value: 'header-id' },
          { name: 'location', value: `https://trakt.tv/?${name}=query-id` },
        ],
        secrets: [],
      });

      expect(JSON.stringify(result)).not.toMatch(/body-id|header-id|query-id/);
      expect(JSON.parse(result.body).title).toBe('TRON');
      expect(
        redactResponse({
          body: `<p>${name}=body-id</p>`,
          isJson: false,
          headers: [],
          secrets: [],
        }).body,
      ).toBe('[Sensitive non-JSON response omitted]');
    },
  );

  it('should remove credentials from nested JSON and echoed header values', () => {
    const result = redactResponse({
      body: JSON.stringify({
        access_token: 'newly-issued-token',
        nested: [{ clientSecret: 'secret', title: 'TRON' }],
        echo: 'Bearer session-token',
      }),
      isJson: true,
      headers: [
        { name: 'trakt-api-key', value: 'app-key' },
        {
          name: 'location',
          value:
            'https://example.test/?echo=session-token&access_token=unseen-token',
        },
      ],
      secrets: ['session-token', 'app-key'],
    });

    expect(JSON.stringify(result)).not.toMatch(
      /newly-issued-token|session-token|app-key|unseen-token/,
    );
    expect(JSON.parse(result.body)).toEqual({
      access_token: '[REDACTED]',
      nested: [{ clientSecret: '[REDACTED]', title: 'TRON' }],
      echo: 'Bearer [REDACTED]',
    });
    expect(result.headers.every(({ value }) => value.includes('[REDACTED]')))
      .toBe(true);
  });

  it('should omit suspicious non-JSON bodies and redact known values anywhere', () => {
    expect(
      redactResponse({
        body: '<p>access_token=issued-token</p>',
        isJson: false,
        headers: [],
        secrets: [],
      }).body,
    ).toBe('[Sensitive non-JSON response omitted]');

    expect(
      redactResponse({
        body: 'Echo: a%2Fb',
        isJson: false,
        headers: [],
        secrets: ['a/b'],
      }).body,
    ).toBe('Echo: [REDACTED]');
  });
});
