<script lang="ts">
  import type { EndpointSidebarProps } from "./EndpointSidebarProps.ts";

  const {
    endpoints,
    selectedId,
    query,
    isLoading,
    onQuery,
    onSelect,
  }: EndpointSidebarProps = $props();

  const groupedEndpoints = $derived.by(() => {
    return Object.entries(
      endpoints.reduce<Record<string, Array<(typeof endpoints)[number]>>>(
        (groups, endpoint) => {
          const tag = endpoint.tags.at(0) ?? "Other";
          return { ...groups, [tag]: [...(groups[tag] ?? []), endpoint] };
        },
        {},
      ),
    ).sort(([a], [b]) => a.localeCompare(b));
  });
</script>

<aside class="trakt-endpoint-sidebar">
  <div class="sidebar-search">
    <div class="search-field">
      <span aria-hidden="true">⌕</span>
      <input
        id="endpoint-search"
        type="search"
        aria-label="Search endpoints"
        value={query}
        placeholder="Search"
        oninput={(event) => onQuery(event.currentTarget.value)}
      />
      <kbd>⌘K</kbd>
    </div>
  </div>

  <div class="catalog-meta">
    <span>{endpoints.length} operations</span>
    {#if isLoading}<span class="catalog-status">Updating…</span>{/if}
  </div>

  <nav aria-label="API endpoints" class="endpoint-groups">
    {#each groupedEndpoints as [tag, taggedEndpoints] (tag)}
      <section class="endpoint-group">
        <h2>{tag}</h2>
        {#each taggedEndpoints as endpoint (endpoint.id)}
          <button
            type="button"
            class:is-selected={endpoint.id === selectedId}
            onclick={() => onSelect(endpoint)}
          >
            <span class="method" data-method={endpoint.method}
              >{endpoint.method}</span
            >
            <span class="endpoint-copy">
              <span class="summary">{endpoint.summary}</span>
              <span class="path">{endpoint.path}</span>
            </span>
          </button>
        {/each}
      </section>
    {:else}
      <div class="empty-search">
        <strong>No endpoints found</strong>
        <span>Try another path, operation, or title.</span>
      </div>
    {/each}
  </nav>
</aside>

<style lang="scss">
  .trakt-endpoint-sidebar {
    display: flex;
    min-width: 0;
    min-height: 0;
    flex-direction: column;

    background: var(--color-surface);

    .sidebar-search {
      padding: var(--ni-16);
      border-block-end: var(--ni-1) solid var(--color-border);
    }

    .search-field {
      display: grid;
      grid-template-columns: auto 1fr auto;
      align-items: center;
      gap: 8px;

      min-height: var(--ni-38);
      padding-inline: var(--ni-10);

      border: var(--ni-1) solid var(--color-border-strong);
      border-radius: var(--radius-control);
      background: var(--color-canvas);
    }

    .search-field > span {
      color: var(--color-muted);
      font-size: var(--ni-20);
    }

    .search-field input {
      width: 100%;
      height: var(--ni-36);
      min-width: 0;
      padding: 0;

      border: 0;
      outline: 0;

      appearance: none;
      background: transparent;

      font-size: var(--ni-12);
      line-height: 1.4;
    }

    .search-field kbd {
      padding: 0;
      border: 0;

      color: var(--color-subtle);
      font:
        500 var(--ni-11)/1 -apple-system,
        BlinkMacSystemFont,
        "Segoe UI",
        sans-serif;
    }

    .catalog-meta {
      display: flex;
      justify-content: space-between;
      gap: 8px;

      padding: 9px var(--ni-16);
      border-block-end: var(--ni-1) solid var(--color-border);

      color: var(--color-subtle);
      font-size: var(--ni-11);
    }

    .catalog-status {
      overflow: hidden;
      max-width: 55%;

      color: var(--color-warning);
      text-overflow: ellipsis;
      white-space: nowrap;
    }

    .endpoint-groups {
      overflow: auto;
      min-height: 0;
      padding: var(--ni-10);
    }

    .endpoint-group h2 {
      margin: var(--ni-12) 8px var(--ni-8);

      color: var(--color-subtle);
      font-size: var(--ni-11);
      letter-spacing: 0.06em;
      text-transform: uppercase;
    }

    .endpoint-group button {
      display: grid;
      width: 100%;
      grid-template-columns: 47px minmax(0, 1fr);
      align-items: start;
      gap: 8px;

      padding: 9px 8px;
      border: var(--ni-1) solid transparent;
      border-radius: var(--radius-medium);
      background: transparent;

      text-align: start;
    }

    .endpoint-group button:hover {
      background: var(--color-surface-hover);
    }

    .endpoint-group button.is-selected {
      border-color: var(--color-border-strong);
      background: var(--color-surface-hover);
    }

    .endpoint-group button + button {
      margin-block-start: var(--ni-2);
    }

    .method {
      margin-block-start: var(--ni-2);
      font: 700 var(--ni-10) var(--font-mono);
    }

    .method[data-method="GET"] {
      color: var(--color-get);
    }

    .method[data-method="POST"] {
      color: var(--color-post);
    }

    .method[data-method="PUT"] {
      color: var(--color-put);
    }

    .method[data-method="PATCH"] {
      color: var(--color-patch);
    }

    .method[data-method="DELETE"] {
      color: var(--color-delete);
    }

    .endpoint-copy {
      display: grid;
      min-width: 0;
      gap: var(--ni-3);
    }

    .summary,
    .path {
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }

    .summary {
      font-size: 13px;
      font-weight: 570;
    }

    .path {
      color: var(--color-subtle);
      font: var(--ni-11) var(--font-mono);
    }

    .empty-search {
      display: grid;
      gap: var(--ni-8);
      padding: var(--ni-28) var(--ni-14);

      color: var(--color-muted);
      text-align: center;
    }

    .empty-search strong {
      color: var(--color-foreground);
      font-size: 13px;
    }

    .empty-search span {
      font-size: var(--ni-12);
    }
  }
</style>
