const AVATAR_PIXELS = 104;

export function githubAvatarUrl(githubId: number): string {
  return `https://avatars.githubusercontent.com/u/${githubId}?s=${AVATAR_PIXELS}`;
}
