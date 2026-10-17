import { beforeEach, describe, expect, it, vi } from 'vitest';

const calls: string[] = [];
let failTesterAdd = false;

vi.mock('./addManager.ts', () => ({
  addManager: (_slot: number, _appId: number, slug: string) => {
    calls.push(`addManager:${slug}`);
    return Promise.resolve();
  },
}));
vi.mock('./removeManager.ts', () => ({
  removeManager: (_slot: number, _appId: number, slug: string) => {
    calls.push(`removeManager:${slug}`);
    return Promise.resolve();
  },
}));
vi.mock('./addAllowedUser.ts', () => ({
  addAllowedUser: (_slot: number, _appId: number, slug: string) => {
    calls.push(`addAllowedUser:${slug}`);
    return failTesterAdd
      ? Promise.reject(new Error('seats full'))
      : Promise.resolve();
  },
}));

const { changeMemberRole } = await import('./changeMemberRole.ts');

const target = { slot: 0, appId: 7 };
const manager = {
  username: 'seftur',
  slug: 'seftur',
  role: 'manager' as const,
  addedAt: '2026-10-17T10:00:00.000Z',
};

describe('changeMemberRole', () => {
  beforeEach(() => {
    calls.length = 0;
    failTesterAdd = false;
  });

  it('promotes a tester in one call', async () => {
    await changeMemberRole(target, { ...manager, role: 'tester' }, 'manager');
    expect(calls).toEqual(['addManager:seftur']);
  });

  it('demotes a manager by removing then adding as a tester', async () => {
    await changeMemberRole(target, manager, 'tester');
    expect(calls).toEqual(['removeManager:seftur', 'addAllowedUser:seftur']);
  });

  it('restores the manager when the tester add fails', async () => {
    failTesterAdd = true;
    await expect(changeMemberRole(target, manager, 'tester')).rejects.toThrow(
      'seats full',
    );
    expect(calls).toEqual([
      'removeManager:seftur',
      'addAllowedUser:seftur',
      'addManager:seftur',
    ]);
  });
});
