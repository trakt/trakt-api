import { beforeEach, describe, expect, it, vi } from 'vitest';

const calls: string[] = [];
let failTesterAdd = false;

vi.mock('./addMember.ts', () => ({
  addMember: (_target: unknown, slug: string, role: string) => {
    calls.push(`add:${role}:${slug}`);
    return failTesterAdd && role === 'tester'
      ? Promise.reject(new Error('seats full'))
      : Promise.resolve();
  },
}));
vi.mock('./removeMember.ts', () => ({
  removeMember: (_target: unknown, member: { slug: string; role: string }) => {
    calls.push(`remove:${member.role}:${member.slug}`);
    return Promise.resolve();
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
    expect(calls).toEqual(['add:manager:seftur']);
  });

  it('demotes a manager by removing then adding as a tester', async () => {
    await changeMemberRole(target, manager, 'tester');
    expect(calls).toEqual(['remove:manager:seftur', 'add:tester:seftur']);
  });

  it('restores the manager when the tester add fails', async () => {
    failTesterAdd = true;
    await expect(changeMemberRole(target, manager, 'tester')).rejects.toThrow(
      'seats full',
    );
    expect(calls).toEqual([
      'remove:manager:seftur',
      'add:tester:seftur',
      'add:manager:seftur',
    ]);
  });
});
