<script lang="ts">
  import { onMount } from "svelte";
  import type { AppSectionNavProps } from "./AppSectionNavProps.ts";

  const { sections, active }: AppSectionNavProps = $props();

  onMount(() => {
    if (!globalThis.location.hash) return;
    requestAnimationFrame(() =>
      requestAnimationFrame(() =>
        document.getElementById(active)?.scrollIntoView(),
      ),
    );
  });
</script>

<nav class="trakt-app-section-nav" aria-label="App sections">
  {#each sections as section (section.id)}<a
      class="section-link"
      class:is-selected={section.id === active}
      href={`#${section.id}`}
      aria-current={section.id === active ? "location" : undefined}
      >{section.label}</a
    >{/each}
</nav>

<style lang="scss">
  .trakt-app-section-nav {
    position: sticky;
    inset-block-start: var(--gap-l);
    display: grid;
    gap: var(--ni-2);
    padding: var(--ni-8);
    border: var(--border-thickness-xxs) solid var(--color-border);
    border-radius: var(--radius-large);
    background: var(--color-surface);

    .section-link {
      padding: var(--ni-10) var(--ni-12);
      border-radius: var(--radius-control);
      color: var(--color-muted);
      font-size: var(--ni-14);
      font-weight: 600;
      text-decoration: none;

      &:hover,
      &.is-selected {
        background: var(--color-surface-hover);
        color: var(--color-foreground);
      }
    }

    @media (max-width: 700px) {
      position: static;
      display: flex;
      overflow-x: auto;

      .section-link {
        flex: 0 0 auto;
      }
    }
  }
</style>
