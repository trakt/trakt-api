import { describe, expect, it } from 'vitest';
import type { OAuthSession } from './OAuthSession.ts';
import { decryptSession, encryptSession } from './sessionCipher.ts';

const SESSION: OAuthSession = {
  accessToken: 'access-token-that-must-not-leak',
  refreshToken: 'refresh-token-that-must-not-leak',
  tokenType: 'bearer',
  scope: 'public',
  createdAt: 1_700_000_000,
  expiresAt: 1_800_000_000,
  username: 'developer',
};

describe('sessionCipher', () => {
  it('should reject a weak session encryption secret', async () => {
    await expect(encryptSession({ session: SESSION, secret: 'short' }))
      .rejects.toThrow('at least 32 characters');
  });

  it('should encrypt and decrypt an OAuth session without plaintext tokens', async () => {
    const encrypted = await encryptSession({
      session: SESSION,
      secret: 'a-long-test-secret-with-at-least-32-characters',
    });

    expect(encrypted).not.toContain(SESSION.accessToken);
    expect(encrypted).not.toContain(SESSION.refreshToken);
    await expect(decryptSession({
      value: encrypted,
      secret: 'a-long-test-secret-with-at-least-32-characters',
    })).resolves.toEqual(SESSION);
  });

  it('should reject a session encrypted with another secret', async () => {
    const encrypted = await encryptSession({
      session: SESSION,
      secret: 'first-test-secret-with-at-least-32-characters',
    });

    await expect(decryptSession({
      value: encrypted,
      secret: 'second-test-secret-with-at-least-32-characters',
    })).resolves.toBeNull();
  });
});
