const wrappedFetches = new WeakSet<typeof fetch>();

export function authFetch(fetcher: typeof fetch): typeof fetch {
  if (wrappedFetches.has(fetcher)) return fetcher;

  const wrapped: typeof fetch = async (input, init) => {
    const response = await fetcher.call(globalThis, input, init);

    // oidc-client-ts passes its timeout through to fetch, but clears the timer
    // before reading JSON. Keep that timer alive until the body is buffered.
    if (
      init && 'timeoutInSeconds' in init &&
      typeof init.timeoutInSeconds === 'number' && init.timeoutInSeconds > 0
    ) {
      await response.clone().arrayBuffer();
    }

    return response;
  };
  wrappedFetches.add(wrapped);
  return wrapped;
}
