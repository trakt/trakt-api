function isThrottled(error: unknown): boolean {
  return error instanceof DOMException && error.name === 'SecurityError';
}

export function replaceHistoryUrlUnlessThrottled({
  history,
  url,
}: {
  history: History;
  url: URL;
}) {
  try {
    history.replaceState(history.state, '', url);
  } catch (error) {
    if (!isThrottled(error)) throw error;
  }
}
