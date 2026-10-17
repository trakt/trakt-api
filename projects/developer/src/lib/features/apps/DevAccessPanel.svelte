<script lang="ts">
  import { onMount } from "svelte";
  import { addAllowedUser } from "./addAllowedUser.ts";
  import type { AllowedUser } from "./AllowedUser.ts";
  import type { DevAccessPanelProps } from "./DevAccessPanelProps.ts";
  import { formatDate } from "./formatDate.ts";
  import { listAllowedUsers } from "./listAllowedUsers.ts";
  import { removeAllowedUser } from "./removeAllowedUser.ts";

  const { slot, appId, managerCount }: DevAccessPanelProps = $props();

  let users = $state<AllowedUser[]>([]);
  let limit = $state(0);
  let loading = $state(true);
  let busy = $state(false);
  let error = $state("");
  let username = $state("");
  let alive = true;

  const seatsUsed = $derived(1 + managerCount + users.length);
  const atLimit = $derived(!loading && seatsUsed >= limit);

  onMount(() => {
    void load();
    return () => {
      alive = false;
    };
  });

  function initialOf(name: string): string {
    return name.trim().charAt(0).toUpperCase();
  }

  async function load() {
    try {
      const list = await listAllowedUsers(slot, appId);
      if (!alive) return;
      users = list.users;
      limit = list.limit;
    } catch (cause) {
      if (alive)
        error =
          cause instanceof Error
            ? cause.message
            : "The sign-in list could not be read.";
    } finally {
      if (alive) loading = false;
    }
  }

  async function add(event: SubmitEvent) {
    event.preventDefault();
    const target = username.trim();
    if (busy || !target) return;
    busy = true;
    error = "";
    try {
      await addAllowedUser(slot, appId, target);
      if (!alive) return;
      username = "";
      await load();
    } catch (cause) {
      if (alive)
        error =
          cause instanceof Error ? cause.message : "Could not add this person.";
    } finally {
      if (alive) busy = false;
    }
  }

  async function remove(entry: AllowedUser) {
    if (busy) return;
    busy = true;
    error = "";
    try {
      await removeAllowedUser(slot, appId, entry.user.ids.slug);
      if (!alive) return;
      users = users.filter(
        (user) => user.user.ids.slug !== entry.user.ids.slug,
      );
    } catch (cause) {
      if (alive)
        error =
          cause instanceof Error
            ? cause.message
            : "Could not remove this person.";
    } finally {
      if (alive) busy = false;
    }
  }
</script>

<section class="trakt-dev-access-panel" aria-labelledby="dev-access-title">
  <div class="panel-head">
    <h2 class="title" id="dev-access-title">Who can sign in</h2>
    {#if !loading}<span class="count">{seatsUsed} of {limit}</span>{/if}
  </div>
  <p class="muted">
    Only these accounts can sign in to this app, plus its owner and managers.
    {#if !loading}Up to {limit} people in total, owner and managers included.{/if}
  </p>
  <ul class="people" aria-busy={loading}>
    {#each users as entry (entry.user.ids.slug)}
      <li class="person">
        <span class="avatar" aria-hidden="true"
          >{initialOf(entry.user.username)}</span
        ><span class="who"
          ><strong class="username">{entry.user.username}</strong><small
            class="meta">Added {formatDate(entry.added_at)}</small
          ></span
        ><button
          class="remove"
          disabled={busy}
          aria-label={`Remove ${entry.user.username}`}
          onclick={() => remove(entry)}>Remove</button
        >
      </li>
    {/each}
  </ul>
  {#if error}<p class="error" role="alert">{error}</p>{/if}
  <form class="add-row" onsubmit={add}>
    <input
      class="username-input"
      bind:value={username}
      placeholder="Trakt username"
      aria-label="Trakt username"
      autocomplete="off"
      spellcheck="false"
      disabled={busy || atLimit}
    /><button
      class="add-button"
      type="submit"
      disabled={busy || atLimit || !username.trim()}
      aria-busy={busy}>Add</button
    >
  </form>
</section>

<style lang="scss">
  @use "../../../style/member-panel" as panel;

  .trakt-dev-access-panel {
    @include panel.member-panel;
  }
</style>
