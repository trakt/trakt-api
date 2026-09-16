<script lang="ts">
  import { takeReturnPath } from "$lib/auth/accountNavigation.ts";
  import { completeSignIn } from "$lib/auth/completeSignIn.ts";
  import LoadingSpinner from "$lib/features/developer/LoadingSpinner.svelte";
  import { onMount } from "svelte";

  let error = $state<string | null>(null);

  onMount(async () => {
    try {
      await completeSignIn();
      globalThis.location.replace(takeReturnPath());
    } catch (cause) {
      error =
        cause instanceof Error
          ? cause.message
          : "This sign-in could not be completed.";
    }
  });
</script>

<svelte:head>
  <title>Signing in | Trakt Developer</title>
</svelte:head>

<main>
  {#if error}
    <h1>Sign-in failed</h1>
    <p>{error}</p>
    <a href="/">Return to the developer portal</a>
  {:else}
    <LoadingSpinner />
    <p>Completing sign-in...</p>
  {/if}
</main>

<style lang="scss">
  main {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: var(--ni-16);
    min-height: 100vh;
    text-align: center;
  }
</style>
