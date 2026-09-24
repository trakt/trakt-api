import { User, UserManager } from 'oidc-client-ts';
import { describe, expect, it, vi } from 'vitest';
import { accountSessionErrors } from './accountSessionErrors.ts';
import { ACCOUNT_LIMIT } from './ACCOUNT_LIMIT.ts';
import { observeAccountChanges } from './observeAccountChanges.ts';

function setup() {
  const events = Array.from(
    { length: ACCOUNT_LIMIT },
    () =>
      new UserManager({
        authority: 'https://auth.trakt.tv',
        client_id: 'test',
        redirect_uri: 'https://developer.trakt.tv/callback',
        automaticSilentRenew: false,
      }).events,
  );
  const target = new EventTarget();
  const onChange = vi.fn();
  const stop = observeAccountChanges(onChange, {
    manager: (slot) => {
      const event = events.at(slot);
      if (!event) throw new Error('Invalid slot');
      return { events: event };
    },
    target,
  });
  return { events, target, onChange, stop };
}

function user() {
  return new User({
    access_token: 'refreshed',
    token_type: 'Bearer',
    profile: { sub: 'account', iss: 'trakt', aud: 'portal', exp: 0, iat: 0 },
  });
}

describe('observe account changes', () => {
  it('updates after a session failure and clears it when the session renews', async () => {
    const { events, onChange, stop } = setup();
    accountSessionErrors.mark(0);
    expect(onChange).toHaveBeenCalledTimes(1);
    expect(accountSessionErrors.has(0)).toBe(true);
    await events.at(0)?.load(user());
    expect(accountSessionErrors.has(0)).toBe(false);
    expect(onChange).toHaveBeenCalledTimes(2);
    stop();
  });

  it('clears errors when another tab replaces the stored session', () => {
    const { target, stop } = setup();
    accountSessionErrors.mark(0);
    target.dispatchEvent(Object.assign(new Event('storage'), {
      key: 'trakt-developer-account-0.user:https://auth.trakt.tv:client',
    }));
    expect(accountSessionErrors.has(0)).toBe(false);
    stop();
  });

  it('updates for refreshed sessions and logout in every account slot', async () => {
    const { events, onChange, stop } = setup();
    for (const event of events) {
      await event.load(user());
      await event.unload();
    }
    expect(onChange).toHaveBeenCalledTimes(ACCOUNT_LIMIT * 2);
    stop();
  });

  it('does not notify when account listings read stored users without raising events', async () => {
    const { events, onChange, stop } = setup();
    await events.at(0)?.load(user(), false);
    expect(onChange).not.toHaveBeenCalled();
    stop();
  });

  it('updates for cross-tab session changes but ignores cooldown and unrelated writes', () => {
    const { target, onChange, stop } = setup();
    for (const key of ['trakt-developer-refresh-retry-0', 'unrelated']) {
      target.dispatchEvent(Object.assign(new Event('storage'), { key }));
    }
    expect(onChange).not.toHaveBeenCalled();
    for (
      const key of [
        'trakt-developer-account-0.user:https://auth.trakt.tv:client',
        'trakt-developer-username-1',
        null,
      ]
    ) {
      target.dispatchEvent(Object.assign(new Event('storage'), { key }));
    }
    expect(onChange).toHaveBeenCalledTimes(3);
    stop();
  });

  it('removes all subscriptions on teardown', async () => {
    const { events, target, onChange, stop } = setup();
    stop();
    for (const event of events) {
      await event.load(user());
      await event.unload();
    }
    target.dispatchEvent(Object.assign(new Event('storage'), { key: null }));
    expect(onChange).not.toHaveBeenCalled();
  });
});
