const errors = new Set<number>();
const listeners = new Set<() => void>();

export const accountSessionErrors = {
  has: (slot: number): boolean => errors.has(slot),
  mark(slot: number): void {
    if (errors.has(slot)) return;

    errors.add(slot);
    listeners.forEach((listener) => listener());
  },
  clear(slot: number): void {
    errors.delete(slot);
  },
  subscribe(listener: () => void): () => void {
    listeners.add(listener);
    return () => {
      listeners.delete(listener);
    };
  },
};
