<script lang="ts">
  import ApplicationPage from "$lib/features/apps/ApplicationPage.svelte";
  import { page } from "$app/state";
</script>

<ApplicationPage
  mode="detail"
  appId={Number(page.params.id)}
  appName={page.url.searchParams.get("name")?.trim().slice(0, 255)}
/>
