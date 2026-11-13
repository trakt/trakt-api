import { describe, expect, it } from 'vitest';
import { requestsClientSecret } from './requestsClientSecret.ts';

describe('requestsClientSecret', () => {
  it('requests a secret only for PKCE apps that do not have one', () => {
    const answers = { needsSecret: true, hasClientSecret: false };

    expect(requestsClientSecret({ ...answers, signIn: 'pkce' })).toBe(true);
    expect(requestsClientSecret({ ...answers, signIn: 'none' })).toBe(false);
    expect(requestsClientSecret({ ...answers, signIn: 'device_code' })).toBe(
      false,
    );
    expect(
      requestsClientSecret({
        ...answers,
        hasClientSecret: true,
        signIn: 'pkce',
      }),
    ).toBe(false);
  });
});
