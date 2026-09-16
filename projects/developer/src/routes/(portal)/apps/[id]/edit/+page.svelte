<script lang="ts">
  import ApplicationPage from "$lib/features/apps/ApplicationPage.svelte";
  import { applicationNameFrom } from "$lib/features/apps/applicationUrl.ts";
  import { page } from "$app/state";
</script>

<ApplicationPage
  mode="edit"
  appId={Number(page.params.id)}
  appName={applicationNameFrom(page.url)}
/>
