import { describe, expect, it, vi } from 'vitest';
import { observeAccountChangesLazily } from './observeAccountChangesLazily.ts';

function deferredModule() {
  const stop = vi.fn();
  const observeAccountChanges = vi.fn(() => stop);
  let resolve: (module: {
    observeAccountChanges: typeof observeAccountChanges;
  }) => void = () => undefined;
  const load = vi.fn(
    () =>
      new Promise<{ observeAccountChanges: typeof observeAccountChanges }>(
        (done) => {
          resolve = done;
        },
      ),
  );

  return {
    stop,
    observeAccountChanges,
    load,
    resolve: () => resolve({ observeAccountChanges }),
  };
}

describe('observeAccountChangesLazily', () => {
  it('does not attach the listener before the module has loaded', () => {
    const module = deferredModule();

    observeAccountChangesLazily(() => undefined, module.load);

    expect(module.observeAccountChanges).not.toHaveBeenCalled();
  });

  it('attaches the listener once the module has loaded', async () => {
    const module = deferredModule();
    const onChange = vi.fn();

    observeAccountChangesLazily(onChange, module.load);
    module.resolve();
    await Promise.resolve();

    expect(module.observeAccountChanges).toHaveBeenCalledWith(onChange);
  });

  it('removes the listener when torn down after the module has loaded', async () => {
    const module = deferredModule();

    const stop = observeAccountChangesLazily(() => undefined, module.load);
    module.resolve();
    await Promise.resolve();
    stop();

    expect(module.stop).toHaveBeenCalledTimes(1);
  });

  it('never attaches when torn down before the module has loaded', async () => {
    const module = deferredModule();

    const stop = observeAccountChangesLazily(() => undefined, module.load);
    stop();
    module.resolve();
    await Promise.resolve();

    expect(module.observeAccountChanges).not.toHaveBeenCalled();
  });

  it('survives a module that fails to load', async () => {
    const stop = observeAccountChangesLazily(
      () => undefined,
      () => Promise.reject(new Error('offline')),
    );
    await Promise.resolve();

    expect(() => stop()).not.toThrow();
  });
});
