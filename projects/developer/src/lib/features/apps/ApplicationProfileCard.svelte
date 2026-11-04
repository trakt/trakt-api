<script lang="ts">
  import type { ApplicationProfileInput } from "./ApplicationProfileInput.ts";
  import { formatDate } from "./formatDate.ts";
  import { isWebUrl } from "./isWebUrl.ts";
  import { profileUsageLabel } from "./profileUsageLabel.ts";

  const {
    profile,
    updated,
  }: {
    profile: ApplicationProfileInput;
    updated?: { at: string; by: string };
  } = $props();
</script>

{#snippet links(urls: string[])}
  <ul class="links">
    {#each urls as url (url)}<li>
        {#if isWebUrl(url)}
          <a href={url} target="_blank" rel="noopener noreferrer">{url}</a>
        {:else}
          {url}
        {/if}
      </li>{/each}
  </ul>
{/snippet}

<dl class="trakt-application-profile-card">
  <dt>What it does</dt>
  <dd class="summary">{profile.summary}</dd>
  <dt>Open source</dt>
  <dd>{profile.open_source ? "Yes" : "No"}</dd>
  <dt>Links</dt>
  <dd>{@render links(profile.product_links)}</dd>
  <dt>Privacy policy</dt>
  <dd>{@render links([profile.privacy_url])}</dd>
  <dt>Trakt notice</dt>
  <dd>{@render links(profile.notice_links)}</dd>
  <dt>Expected users</dt>
  <dd>{profile.expected_mau.toLocaleString()} a month</dd>
  <dt>Uses Trakt for</dt>
  <dd>{profileUsageLabel(profile)}</dd>
  <dt>Movie and show data</dt>
  <dd>{profile.other_data_sources ?? "Only Trakt"}</dd>
  <dt>Syncs with</dt>
  <dd>{profile.other_sync_services ?? "Only Trakt"}</dd>
  {#if updated}<dt>Updated</dt>
    <dd>{formatDate(updated.at)} by @{updated.by}</dd>{/if}
</dl>

<style lang="scss">
  .trakt-application-profile-card {
    display: grid;
    grid-template-columns: max-content minmax(0, 1fr);
    gap: var(--gap-s) var(--gap-l);
    margin: 0;
    font-size: 13px;

    dt {
      color: var(--color-muted);
      font-size: 12px;
    }

    dd {
      margin: 0;
      overflow-wrap: anywhere;
    }

    .summary {
      white-space: pre-wrap;
      line-height: 1.6;
    }

    .links {
      display: grid;
      gap: var(--gap-xxs);
      margin: 0;
      padding: 0;
      list-style: none;
    }

    a {
      color: var(--color-info);
    }

    @media (max-width: 640px) {
      grid-template-columns: 1fr;

      dd {
        margin-block-end: var(--gap-s);
      }
    }
  }
</style>
