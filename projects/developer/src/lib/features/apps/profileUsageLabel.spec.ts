import { expect, it } from 'vitest';
import { profileUsageLabel } from './profileUsageLabel.ts';

it.each([
  ['none', false, 'Public data only'],
  ['pkce', true, 'Signs users in (PKCE) · reads and writes'],
  ['device_code', false, 'Signs users in (device code) · read only'],
] as const)('describes %s apps that write: %s', (sign_in, writes, label) => {
  expect(profileUsageLabel({ sign_in, writes_user_data: writes })).toBe(label);
});
