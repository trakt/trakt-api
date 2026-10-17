import { describe, expect, it } from 'vitest';
import { memberPath } from './memberPath.ts';

describe('memberPath', () => {
  it('points managers at the managers collection', () => {
    expect(memberPath({ appId: 7, role: 'manager', username: 'seftur' })).toBe(
      '/v3/users/me/applications/7/managers/seftur',
    );
  });

  it('points testers at the allowed users collection', () => {
    expect(memberPath({ appId: 7, role: 'tester', username: 'seftur' })).toBe(
      '/v3/users/me/applications/7/allowed-users/seftur',
    );
  });

  it('encodes the username', () => {
    expect(memberPath({ appId: 7, role: 'tester', username: 'a b/c' })).toBe(
      '/v3/users/me/applications/7/allowed-users/a%20b%2Fc',
    );
  });
});
