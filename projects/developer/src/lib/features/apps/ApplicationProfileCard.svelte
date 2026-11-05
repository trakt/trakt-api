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
          <a class="link" href={url} target="_blank" rel="noopener noreferrer"
            >{url}</a
          >
        {:else}
          {url}
        {/if}
      </li>{/each}
  </ul>
{/snippet}

<dl class="trakt-application-profile-card">
  <dt class="term">What it does</dt>
  <dd class="detail summary">{profile.summary}</dd>
  <dt class="term">Open source</dt>
  <dd class="detail">{profile.open_source ? "Yes" : "No"}</dd>
  <dt class="term">Links</dt>
  <dd class="detail">{@render links(profile.product_links)}</dd>
  <dt class="term">Privacy policy</dt>
  <dd class="detail">{@render links([profile.privacy_url])}</dd>
  <dt class="term">Trakt notice</dt>
  <dd class="detail">{@render links(profile.notice_links)}</dd>
  <dt class="term">Expected users</dt>
  <dd class="detail">{profile.expected_mau.toLocaleString()} a month</dd>
  <dt class="term">Uses Trakt for</dt>
  <dd class="detail">{profileUsageLabel(profile)}</dd>
  <dt class="term">Movie and show data</dt>
  <dd class="detail">{profile.other_data_sources ?? "Only Trakt"}</dd>
  <dt class="term">Syncs with</dt>
  <dd class="detail">{profile.other_sync_services ?? "Only Trakt"}</dd>
  {#if updated}<dt class="term">Updated</dt>
    <dd class="detail">{formatDate(updated.at)} by @{updated.by}</dd>{/if}
</dl>

<style lang="scss">
  .trakt-application-profile-card {
    display: grid;
    grid-template-columns: max-content minmax(0, 1fr);
    gap: var(--gap-s) var(--gap-l);
    margin: 0;
    font-size: 13px;

    .term {
      color: var(--color-muted);
      font-size: var(--ni-12);
    }

    .detail {
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

    .link {
      color: var(--color-info);
    }

    @media (max-width: 640px) {
      grid-template-columns: 1fr;

      .detail {
        margin-block-end: var(--gap-s);
      }
    }
  }
</style>
