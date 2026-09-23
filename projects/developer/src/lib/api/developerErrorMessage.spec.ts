import { describe, expect, it } from 'vitest';
import { developerErrorMessage } from './developerErrorMessage.ts';

const API_ERROR_CODES = [
  'authentication_required',
  'invalid_request_body',
  'invalid_application_id',
  'invalid_redirect_uri',
  'invalid_origin',
  'redirect_uris_too_long',
  'origins_too_long',
  'application_limit_reached',
  'application_not_found',
  'application_create_failed',
  'github_required',
  'github_not_linked',
  'github_unavailable',
  'github_code_expired',
  'github_account_taken',
  'github_account_mismatch',
];

describe('developerErrorMessage', () => {
  it.each(API_ERROR_CODES)('has copy for %s', (code) => {
    const message = developerErrorMessage(code);
    expect(message).toBeTruthy();
    expect(message).not.toBe(code);
  });

  it('returns null for an unknown code', () => {
    expect(developerErrorMessage('something_new')).toBeNull();
  });

  it('returns null for anything that is not a string', () => {
    expect(developerErrorMessage(undefined)).toBeNull();
    expect(developerErrorMessage({ secret: 'x' })).toBeNull();
  });

  it('does not resolve inherited object keys', () => {
    expect(developerErrorMessage('toString')).toBeNull();
    expect(developerErrorMessage('__proto__')).toBeNull();
  });
});
