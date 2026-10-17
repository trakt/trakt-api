import { describe, expect, it } from 'vitest';
import { githubAvatarUrl } from './githubAvatarUrl.ts';

describe('githubAvatarUrl', () => {
  it('builds the avatar URL from the GitHub account id at twice the shown size', () => {
    expect(githubAvatarUrl(6339681)).toBe(
      'https://avatars.githubusercontent.com/u/6339681?s=104',
    );
  });
});
