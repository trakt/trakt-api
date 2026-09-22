<script lang="ts">
  import { onMount } from "svelte";
  import ApplicationPage from "$lib/features/apps/ApplicationPage.svelte";
  import {
    completeGithubConnect,
    isGithubCallback,
  } from "$lib/features/apps/githubConnect.ts";

  let connectError = $state<"denied" | "invalid" | null>(null);

  onMount(() => {
    const url = new URL(globalThis.location.href);
    if (!isGithubCallback(url.searchParams)) return;
    const outcome = completeGithubConnect(url.searchParams);
    if (outcome.status !== "connected") {
      connectError = outcome.status;
      return;
    }
    globalThis.location.replace(outcome.returnPath);
  });
</script>

{#if connectError}
  <section class="connect-error">
    <h1>
      {connectError === "denied"
        ? "GitHub connection cancelled"
        : "GitHub connection failed"}
    </h1>
    <p>
      {connectError === "denied"
        ? "You did not authorize the connection. Return to your app and try again."
        : "This connection could not be verified. Return to your app and try again."}
    </p>
    <a href="/apps">Back to My Apps</a>
  </section>
{:else}
  <ApplicationPage mode="list" />
{/if}

<style lang="scss">
  .connect-error {
    padding: 48px 32px;
  }
</style>
