<script lang="ts">
  const { hasSecret }: { hasSecret: boolean } = $props();
</script>

<aside class="trakt-pkce-notice" aria-labelledby="pkce-notice-title">
  <strong id="pkce-notice-title">Sign users in with PKCE</strong>
  <p class="notice-text">
    PKCE is the recommended flow for every app that signs users in, including
    websites, mobile apps, and desktop apps. It only needs your Client ID, so a
    copied Client ID or intercepted code cannot be turned into tokens.
    {#if hasSecret}The Client Secret is deprecated: only use it server to
      server, never in a website, mobile app, or desktop app.{/if}
  </p>
  <a class="guide-link" href="/docs/pkce">Read the PKCE guide →</a>
</aside>

<style lang="scss">
  .trakt-pkce-notice {
    display: grid;
    gap: var(--gap-xs);
    margin: var(--gap-l) 0 0;
    padding: var(--gap-m);
    border: var(--border-thickness-xxs) solid
      color-mix(in srgb, var(--color-info) 40%, var(--color-border));
    border-radius: var(--radius-control);
    background: color-mix(in srgb, var(--color-info) 9%, transparent);
    font-size: 13px;

    .notice-text {
      margin: 0;
      color: var(--color-muted);
      line-height: 1.6;
    }

    .guide-link {
      color: var(--color-info);
      justify-self: start;
    }
  }
</style>
