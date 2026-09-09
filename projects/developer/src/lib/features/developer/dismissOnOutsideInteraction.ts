export function dismissOnOutsideInteraction({
  container,
  trigger,
  onDismiss,
}: {
  container: () => HTMLElement | undefined;
  trigger: () => HTMLElement | undefined;
  onDismiss: () => void;
}): () => void {
  function closeOnOutsidePointer(event: PointerEvent) {
    if (!container()?.contains(event.target as Node)) onDismiss();
  }

  function closeOnEscape(event: KeyboardEvent) {
    if (event.key !== 'Escape') return;
    onDismiss();
    trigger()?.focus();
  }

  globalThis.addEventListener('pointerdown', closeOnOutsidePointer);
  globalThis.addEventListener('keydown', closeOnEscape);

  return () => {
    globalThis.removeEventListener('pointerdown', closeOnOutsidePointer);
    globalThis.removeEventListener('keydown', closeOnEscape);
  };
}
