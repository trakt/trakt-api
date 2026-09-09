export type DeveloperAccount = {
  slot: number;
  username: string;
  expiresAt: number;
  isExpired: boolean;
  source: 'developer-oauth';
};
