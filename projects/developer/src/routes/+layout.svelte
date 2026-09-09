<script lang="ts">
  import "../style/app.scss";

  const { children } = $props();
</script>

<svelte:head>
  <title>Trakt Developer</title>
  <meta
    name="description"
    content="Explore, document, and run requests against the Trakt API."
  />
  <meta name="referrer" content="no-referrer" />
</svelte:head>

{@render children()}
