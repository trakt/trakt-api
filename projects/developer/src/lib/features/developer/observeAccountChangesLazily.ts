import type { observeAccountChanges } from '$lib/auth/observeAccountChanges.ts';

type AccountObserverModule = {
  observeAccountChanges: typeof observeAccountChanges;
};

export function observeAccountChangesLazily(
  onChange: () => void,
  load: () => Promise<AccountObserverModule> = () =>
    import('$lib/auth/observeAccountChanges.ts'),
): () => void {
  let stop: (() => void) | null = null;
  let stopped = false;

  void load()
    .then((module) => {
      if (stopped) return;
      stop = module.observeAccountChanges(onChange);
    })
    .catch(() => undefined);

  return () => {
    stopped = true;
    stop?.();
    stop = null;
  };
}
