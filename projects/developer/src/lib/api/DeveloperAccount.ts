export type DeveloperAccount = {
  slot: number;
  username: string;
  expiresAt: number;
  isExpired: boolean;
  hasSessionError: boolean;
  source: 'developer-oauth';
};
