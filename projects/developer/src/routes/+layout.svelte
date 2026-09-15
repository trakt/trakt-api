<script lang="ts">
  import "../style/app.scss";

  const { children } = $props();
</script>

<svelte:head>
  <meta name="referrer" content="no-referrer" />
</svelte:head>

{@render children()}
