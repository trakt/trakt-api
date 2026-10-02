<script lang="ts">
  const { uris }: { uris: ReadonlyArray<string> } = $props();
</script>

{#if uris.length > 0}<section
    class="trakt-redirect-uri-warning"
    aria-labelledby="redirect-uri-warning-title"
  >
    <h2 class="warning-title" id="redirect-uri-warning-title">
      <span aria-hidden="true">⚠️</span> Insecure redirect URIs
    </h2>
    <p class="warning-text">
      Use <code class="inline-code">https://</code> redirect URIs only. Any app on
      the device can claim a custom scheme or a localhost port and receive your users'
      authorization codes. Mobile apps should use iOS Universal Links and Android
      verified App Links instead.
    </p>
    <ul class="uri-list">
      {#each uris as uri (uri)}<li><code class="uri">{uri}</code></li>{/each}
    </ul>
    <a class="guide-link" href="/docs/pkce">How to set up secure redirects →</a>
  </section>{/if}

<style lang="scss">
  .trakt-redirect-uri-warning {
    display: grid;
    gap: var(--gap-s);
    margin: 0 0 var(--gap-l);
    padding: var(--gap-l);
    border: var(--border-thickness-xxs) solid
      color-mix(in srgb, var(--color-warning) 55%, var(--color-border));
    border-radius: var(--radius-large);
    background: color-mix(in srgb, var(--color-warning) 10%, transparent);

    .warning-title {
      margin: 0;
      color: var(--color-warning);
      font-size: 17px;
    }

    .warning-text {
      margin: 0;
      color: var(--color-foreground);
      font-size: 14px;
      line-height: 1.65;
    }

    .uri-list {
      display: grid;
      gap: var(--gap-xxs);
      margin: 0;
      padding-inline-start: var(--gap-l);
    }

    .inline-code,
    .uri {
      font-size: 12px;
      overflow-wrap: anywhere;
    }

    .guide-link {
      color: var(--color-info);
      justify-self: start;
      font-size: 13px;
    }
  }
</style>
