<script lang="ts">
  import GithubMark from "./GithubMark.svelte";
  import { githubAvatarUrl } from "./githubAvatarUrl.ts";

  const { githubId }: { githubId: number } = $props();

  let failed = $state(false);
</script>

<span class="trakt-github-avatar">
  {#if failed}<GithubMark />{:else}<img
      class="photo"
      src={githubAvatarUrl(githubId)}
      alt=""
      width="52"
      height="52"
      onerror={() => (failed = true)}
    /><span class="mark" aria-hidden="true"><GithubMark size={12} /></span>{/if}
</span>

<style lang="scss">
  .trakt-github-avatar {
    position: relative;
    display: inline-flex;
    flex: none;
    align-items: center;
    justify-content: center;
    inline-size: var(--ni-52);
    block-size: var(--ni-52);
    border-radius: 50%;
    background: var(--color-surface-raised);
    border: var(--border-thickness-xxs) solid var(--color-border);
    color: var(--color-foreground);

    .photo {
      display: block;
      inline-size: 100%;
      block-size: 100%;
      border-radius: 50%;
      object-fit: cover;
    }

    .mark {
      position: absolute;
      inset-block-end: calc(var(--ni-3) * -1);
      inset-inline-end: calc(var(--ni-3) * -1);
      display: grid;
      place-items: center;
      inline-size: var(--ni-20);
      block-size: var(--ni-20);
      border-radius: 50%;
      background: var(--color-canvas);
      border: var(--border-thickness-xxs) solid var(--color-border-strong);
    }
  }
</style>
