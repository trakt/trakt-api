<script lang="ts">
  import type { tokenizeJson } from "./tokenizeJson.ts";

  const { tokens }: { tokens: ReturnType<typeof tokenizeJson> } = $props();
</script>

{#each tokens as token, index (index)}{#if token.type === "plain"}{token.value}{:else}<span
      data-json-token={token.type}>{token.value}</span
    >{/if}{/each}

<style lang="scss">
  [data-json-token="key"] {
    color: var(--purple-400);
  }

  [data-json-token="string"] {
    color: var(--color-get);
  }

  [data-json-token="number"] {
    color: var(--yellow-400);
  }

  [data-json-token="boolean"] {
    color: var(--color-post);
  }

  [data-json-token="null"] {
    color: var(--color-delete);
  }
</style>
