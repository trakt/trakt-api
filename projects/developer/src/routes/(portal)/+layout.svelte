<script lang="ts">
  import DeveloperApp from "$lib/features/developer/DeveloperApp.svelte";

  const { children } = $props();
</script>

<DeveloperApp>{@render children()}</DeveloperApp>
