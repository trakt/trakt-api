export type OAuthSession = {
  accessToken: string;
  refreshToken: string;
  tokenType: string;
  scope: string;
  createdAt: number;
  expiresAt: number;
  username: string;
};
