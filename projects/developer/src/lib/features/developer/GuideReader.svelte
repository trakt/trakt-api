<script lang="ts">
  import GuideCopyButton from "./GuideCopyButton.svelte";
  import contents from "$lib/guides/contents.md?raw";
  import { prepareGuideMarkdown } from "$lib/guides/prepareGuideMarkdown.ts";
  import { parseGuideContents } from "$lib/guides/parseGuideContents.ts";
  import { guideUpdatedAt } from "$lib/guides/guideUpdatedAt.ts";
  import { renderMarkdown } from "$lib/markdown/renderMarkdown.ts";

  import type { Endpoint } from "$lib/openapi/Endpoint.ts";

  const {
    slug,
    endpoints,
  }: {
    slug: string | null;
    endpoints: ReadonlyArray<Endpoint>;
  } = $props();
  const files = import.meta.glob<string>("/src/lib/guides/*.md", {
    query: "?raw",
    import: "default",
    eager: true,
  });
  const guides = new Map(
    Object.entries(files).map(([path, markdown]) => [
      path.split("/").at(-1)!.replace(/\.md$/, ""),
      markdown,
    ]),
  );
  const slugs = new Set(guides.keys());
  const groups = parseGuideContents(contents);
  const selectedSlug = $derived(slug ?? groups[0]?.items[0]?.slug);
  const source = $derived(selectedSlug ? guides.get(selectedSlug) : undefined);
  const updated = $derived(guideUpdatedAt(source ?? ""));
  const markdown = $derived(
    prepareGuideMarkdown(
      source ?? "# Guide not found\n\nChoose a guide from Getting Started.",
      slugs,
      endpoints.map((endpoint) => endpoint.operationId),
    ),
  );
  const html = $derived(renderMarkdown(markdown));
  const titleHtml = $derived(
    html.match(/^<h1\b[^>]*>[\s\S]*?<\/h1>/)?.[0] ?? "",
  );
  const bodyHtml = $derived(html.slice(titleHtml.length));
</script>

<section class="guides" aria-label="Getting Started">
  <nav class="guide-navigation" aria-label="Guide contents">
    {#each groups as group}
      <div class="guide-group">
        <h2>{group.title}</h2>
        {#each group.items as item}
          <a
            href={`/?section=guides&guide=${item.slug}`}
            aria-current={selectedSlug === item.slug ? "page" : undefined}
            >{item.title}</a
          >
        {/each}
      </div>
    {/each}
  </nav>
  {#key selectedSlug}
    <div class="guide-content">
      <article>
        <header class="guide-heading">
          <div class="guide-markdown">{@html titleHtml}</div>
          <GuideCopyButton {markdown} slug={selectedSlug} />
        </header>
        <div class="guide-markdown">{@html bodyHtml}</div>
        {#if updated}
          <footer class="article-updated">
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="1.5"
              stroke-linecap="round"
              stroke-linejoin="round"
              aria-hidden="true"
            >
              <circle cx="12" cy="12" r="9" />
              <path d="M12 7v5l3 2" />
            </svg>
            <time
              datetime={updated.datetime}
              title={`Last edited ${updated.date}`}
            >
              <strong>Updated</strong>
              {updated.relative}
            </time>
            <span class="updated-date">{updated.date}</span>
          </footer>
        {/if}
      </article>
    </div>
  {/key}
</section>

<style lang="scss">
  .guides {
    display: grid;
    grid-template-columns: 280px minmax(0, 1fr);

    min-height: 0;
    overflow: hidden;
  }

  .guide-navigation {
    min-height: 0;
    overflow-y: auto;
    padding: var(--ni-24) var(--ni-14);

    background: var(--color-surface);
    border-inline-end: var(--ni-1) solid var(--color-border);
  }

  .guide-group + .guide-group {
    margin-block-start: var(--ni-24);
  }

  .guide-group h2 {
    margin: 0 var(--ni-10) 8px;
    color: var(--color-subtle);

    font-size: var(--ni-10);
    font-weight: 700;
    letter-spacing: 0.08em;
    text-transform: uppercase;
  }

  .guide-group a {
    display: block;
    padding: 8px var(--ni-10);

    border: var(--ni-1) solid transparent;
    border-radius: var(--radius-medium);

    background: transparent;
    color: var(--color-link);

    font-size: 13px;
    line-height: 1.4;
    text-decoration: none;
  }

  .guide-group a + a {
    margin-block-start: var(--ni-2);
  }

  .guide-group a[aria-current="page"] {
    border-color: var(--color-border-strong);
    background: var(--color-surface-hover);
    color: var(--color-link-current);
  }

  .guide-group a:hover,
  .guide-group a:focus-visible {
    background: var(--color-surface-hover);
    color: var(--color-link-hover);
  }

  .guide-group a:focus-visible {
    outline: var(--ni-2) solid var(--color-info);
    outline-offset: -2px;
  }

  .guide-content {
    min-width: 0;
    overflow: auto;
    padding: var(--ni-40) var(--ni-48) var(--ni-80);
  }

  @media (max-width: 700px) {
    .guides {
      grid-template-columns: 180px minmax(0, 1fr);
    }

    .guide-navigation {
      padding: var(--ni-20) 8px;
    }

    .guide-content {
      padding: var(--ni-24) var(--ni-20) var(--ni-48);
    }

    .guide-group a {
      font-size: var(--ni-12);
    }
  }

  article {
    max-width: 900px;
    margin-inline: auto;
  }

  .guide-heading {
    display: flex;
    align-items: first baseline;
    justify-content: space-between;
    gap: var(--ni-16);
  }

  .guide-heading > .guide-markdown {
    min-width: 0;
  }

  .article-updated {
    display: flex;
    align-items: center;
    flex-wrap: wrap;
    gap: 8px;

    margin-block-start: var(--ni-40);
    padding-block-start: var(--ni-20);
    border-block-start: var(--ni-1) solid var(--color-border);

    color: var(--color-muted);
    font-size: var(--ni-12);
    line-height: 1.6;
  }

  .article-updated svg {
    flex-shrink: 0;
  }

  .article-updated strong {
    color: var(--color-foreground);
    font-weight: 600;
  }

  .updated-date {
    margin-inline-start: auto;
    color: var(--color-muted);
  }

  .guide-markdown {
    line-height: 1.7;
    overflow-wrap: anywhere;
  }

  .guide-markdown :global(h1) {
    font-size: var(--ni-30);
    line-height: 1.25;
    margin-block: 0 var(--ni-24);
  }

  .guide-markdown :global(h2),
  .guide-markdown :global(h3) {
    margin-block-start: var(--ni-32);
  }

  .guide-markdown :global(a) {
    color: var(--color-info);
    text-underline-offset: var(--ni-3);
  }

  .guide-markdown :global(li) {
    margin-block: 8px;
  }

  .guide-markdown :global(code) {
    font-family: var(--font-mono);
    font-size: 0.88em;
  }

  .guide-markdown :global(pre) {
    padding: var(--ni-20);
    overflow-x: auto;

    background: var(--color-surface);
    border-radius: var(--radius-medium);
  }

  .guide-markdown :global(table) {
    display: block;
    max-width: 100%;

    overflow-x: auto;
    overflow-wrap: normal;

    border-collapse: collapse;
    font-size: var(--ni-14);
  }

  .guide-markdown :global(th),
  .guide-markdown :global(td) {
    padding: var(--ni-12) var(--ni-16);
    border: var(--ni-1) solid var(--color-border);
    text-align: start;
  }

  .guide-markdown :global(th) {
    background: var(--color-surface-raised);
  }

  .guide-markdown :global(blockquote) {
    margin-inline: 0;
    padding: var(--ni-4) var(--ni-20);

    border-inline-start: var(--ni-3) solid var(--color-accent);
    background: var(--color-surface);
  }
</style>
