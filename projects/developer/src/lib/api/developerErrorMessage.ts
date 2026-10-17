const DEVELOPER_ERROR_MESSAGES = {
  authentication_required:
    'Your session is no longer valid. Sign in again from the account menu.',
  invalid_request_body:
    'The request could not be accepted. Check your details and try again.',
  invalid_application_id: 'This app could not be found. Reload your apps.',
  invalid_redirect_uri: 'Enter valid redirect URIs, one per line.',
  invalid_origin: 'Enter valid HTTP or HTTPS origins, one per line.',
  redirect_uris_too_long:
    'Enter 1-25 redirect URIs, within 2,048 characters in total.',
  origins_too_long: 'Enter up to 25 origins, within 255 characters in total.',
  application_limit_reached: 'You have reached the app limit for your account.',
  application_not_found: 'This app is no longer available. Reload your apps.',
  application_create_failed: 'The app could not be created. Please try again.',
  github_required: 'Connect your GitHub account before creating an app.',
  github_not_linked: 'No GitHub account is linked to this Trakt account.',
  github_unavailable:
    'GitHub is not responding right now. Please try again in a moment.',
  github_code_expired:
    'The GitHub connection expired before it finished. Connect again.',
  github_account_taken:
    'This GitHub account is already connected to another Trakt account.',
  github_account_mismatch:
    'Your Trakt account is connected to a different GitHub account. Use Switch GitHub account to change it.',
  dev_redirect_not_local:
    'Development apps can only redirect to localhost, 127.0.0.1 or [::1].',
  application_not_dev: 'Only development apps have a sign-in list.',
  user_not_found: 'No Trakt account has that username.',
  cannot_allow_owner: 'You own this app, so you can always sign in to it.',
  allowed_user_limit_reached:
    'This app already has 16 people who can sign in. Remove someone to add another.',
  owner_only: 'Only the app owner can do this.',
} as const;

type DeveloperErrorCode = keyof typeof DEVELOPER_ERROR_MESSAGES;

export function developerErrorMessage(code: unknown): string | null {
  return typeof code === 'string' &&
      Object.hasOwn(DEVELOPER_ERROR_MESSAGES, code)
    ? DEVELOPER_ERROR_MESSAGES[code as DeveloperErrorCode]
    : null;
}
