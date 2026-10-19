import { describe, expect, it, vi } from 'vitest';
import { replaceHistoryUrlUnlessThrottled } from './replaceHistoryUrlUnlessThrottled.ts';

const URL_WITH_STATE = new URL(
  'https://developer.trakt.tv/?section=reference#s=1',
);

function historyThat(replaceState: History['replaceState']): History {
  return { state: { key: 'kept' }, replaceState } as unknown as History;
}

describe('replaceHistoryUrlUnlessThrottled', () => {
  it('replaces the url and keeps the current history state', () => {
    const replaceState = vi.fn();

    replaceHistoryUrlUnlessThrottled({
      history: historyThat(replaceState),
      url: URL_WITH_STATE,
    });

    expect(replaceState).toHaveBeenCalledWith(
      { key: 'kept' },
      '',
      URL_WITH_STATE,
    );
  });

  it('skips the write when the browser throttles history updates', () => {
    const history = historyThat(() => {
      throw new DOMException(
        'Attempt to use history.replaceState() more than 100 times per 30 seconds',
        'SecurityError',
      );
    });

    expect(() =>
      replaceHistoryUrlUnlessThrottled({ history, url: URL_WITH_STATE }),
    ).not.toThrow();
  });

  it('rethrows any other error', () => {
    const history = historyThat(() => {
      throw new TypeError('unexpected');
    });

    expect(() =>
      replaceHistoryUrlUnlessThrottled({ history, url: URL_WITH_STATE }),
    ).toThrow(TypeError);
  });
});
