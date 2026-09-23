import { describe, expect, it } from 'vitest';
import { applicationPermissionLabels } from './applicationPermissionLabels.ts';

describe('applicationPermissionLabels', () => {
  it('lists enabled permissions in a fixed order', () => {
    expect(
      applicationPermissionLabels({
        scrobble: true,
        checkin: false,
        account_create: true,
      }),
    ).toBe('Scrobble, Create accounts');
  });

  it('falls back when no permissions are enabled', () => {
    expect(
      applicationPermissionLabels({
        scrobble: false,
        checkin: null,
        account_create: undefined,
      }),
    ).toBe('No additional permissions');
  });
});
