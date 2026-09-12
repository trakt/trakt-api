<script lang="ts">
  import { dismissOnOutsideInteraction } from "./dismissOnOutsideInteraction.ts";
  const { markdown, slug }: { markdown: string; slug: string | undefined } =
    $props();
  let actions = $state<HTMLDivElement>();
  let trigger = $state<HTMLButtonElement>();
  let isOpen = $state(false);
  let feedback = $state("");

  $effect(() => {
    if (!feedback) return;
    const timeout = globalThis.setTimeout(() => (feedback = ""), 1_800);
    return () => globalThis.clearTimeout(timeout);
  });

  $effect(() => {
    if (!isOpen) return;
    return dismissOnOutsideInteraction({
      container: () => actions,
      trigger: () => trigger,
      onDismiss: () => (isOpen = false),
    });
  });

  async function copy(format: "url" | "markdown") {
    const url = new URL("/", globalThis.location.origin);
    url.searchParams.set("section", "guides");
    if (slug) url.searchParams.set("guide", slug);
    try {
      await navigator.clipboard.writeText(
        format === "url" ? url.href : markdown,
      );
      feedback = format === "url" ? "URL copied" : "Markdown copied";
    } catch {
      feedback = "Could not copy";
    }

    isOpen = false;
    trigger?.focus();
  }
</script>

<div class="guide-copy" bind:this={actions}>
  <button
    type="button"
    class="copy-button"
    bind:this={trigger}
    aria-expanded={isOpen}
    aria-controls="guide-copy-options"
    onclick={() => (isOpen = !isOpen)}
    >Copy <svg aria-hidden="true" viewBox="0 0 12 12"
      ><path d="m3 4.5 3 3 3-3" /></svg
    ></button
  >
  {#if isOpen}
    <div id="guide-copy-options" class="copy-options">
      <button type="button" onclick={() => copy("url")}>Copy URL</button>
      <button type="button" onclick={() => copy("markdown")}
        >Copy as Markdown</button
      >
    </div>
  {/if}
  <span class="copy-feedback" class:visible={!!feedback} role="status"
    >{feedback}</span
  >
</div>

<style lang="scss">
  .guide-copy {
    position: relative;
    flex: 0 0 auto;
  }

  button {
    padding: var(--ni-6) 8px;
    border: 0;
    border-radius: var(--radius-small);

    background: transparent;
    color: var(--color-muted);

    font-size: var(--ni-11);
  }

  button:hover,
  button:focus-visible,
  button[aria-expanded="true"] {
    background: var(--color-surface-hover);
    color: var(--color-foreground);
  }

  .copy-button {
    border: var(--ni-1) solid var(--color-border);
    white-space: nowrap;
  }

  svg {
    width: var(--ni-12);
    height: var(--ni-12);
    margin-inline-start: var(--ni-4);
    vertical-align: middle;

    fill: none;
    stroke: currentColor;
    stroke-width: 1.5;
    stroke-linecap: round;
    stroke-linejoin: round;
  }

  .copy-options {
    position: absolute;
    z-index: 30;
    inset-block-start: calc(100% + var(--ni-8));
    inset-inline-end: 0;

    display: grid;
    width: 184px;
    padding: var(--ni-6);

    border: var(--ni-1) solid var(--color-border-strong);
    border-radius: var(--radius-medium);

    background: var(--color-surface-raised);
    box-shadow: var(--shadow-popover);
  }

  .copy-options button {
    padding: 8px 9px;
    text-align: start;
  }

  .copy-feedback {
    position: absolute;
    z-index: 20;
    inset-block-start: calc(100% + 7px);
    inset-inline-end: 0;

    color: var(--color-muted);
    font-size: var(--ni-10);
    white-space: nowrap;
  }

  .copy-feedback.visible {
    padding: var(--ni-6) 8px;
    border: var(--ni-1) solid var(--color-border);
    border-radius: var(--radius-small);

    background: var(--color-surface-raised);
    box-shadow: var(--shadow-popover);
  }
</style>
