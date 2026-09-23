import { describe, expect, it } from 'vitest';
import { isSensitiveName } from './isSensitiveName.ts';

describe('isSensitiveName', () => {
  it('flags credential names in any casing or separator style', () => {
    const names = [
      'Authorization',
      'Proxy-Authorization',
      'Cookie',
      'Set-Cookie',
      'trakt-api-key',
      'api_key',
      'apiKey',
      'client_id',
      'clientSecret',
      'access_token',
      'refresh-token',
      'id_token',
      'token',
      'secret',
      'password',
      'device_code',
      'code',
    ];

    expect(names.filter((name) => !isSensitiveName(name))).toEqual([]);
  });

  it('flags names that end in or contain a credential word', () => {
    const names = [
      'oauth_token',
      'webhookSecret',
      'adminPassword',
      'x-auth-token',
      'x-api-key-id',
      'token_type',
    ];

    expect(names.filter((name) => !isSensitiveName(name))).toEqual([]);
  });

  it('leaves ordinary field names alone', () => {
    const names = [
      'title',
      'extended',
      'ids',
      'comment',
      'content-type',
      'accept',
      'author',
      'country_code',
    ];

    expect(names.filter(isSensitiveName)).toEqual([]);
  });
});
