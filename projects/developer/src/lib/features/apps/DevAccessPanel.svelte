<script lang="ts">
  import { onMount } from "svelte";
  import { addAllowedUser } from "./addAllowedUser.ts";
  import type { AllowedUser } from "./AllowedUser.ts";
  import type { DevAccessPanelProps } from "./DevAccessPanelProps.ts";
  import { formatDate } from "./formatDate.ts";
  import { listAllowedUsers } from "./listAllowedUsers.ts";
  import { removeAllowedUser } from "./removeAllowedUser.ts";

  const { slot, appId, ownerUsername }: DevAccessPanelProps = $props();

  let users = $state<AllowedUser[]>([]);
  let limit = $state(0);
  let loading = $state(true);
  let busy = $state(false);
  let error = $state("");
  let username = $state("");
  let alive = true;

  const atLimit = $derived(!loading && users.length >= limit);

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
    {#if !loading}<span class="count">{users.length} of {limit}</span>{/if}
  </div>
  <p class="muted">
    Only these accounts can sign in to this app. Everyone else gets an error
    after signing in.
  </p>
  <ul class="people" aria-busy={loading}>
    <li class="person">
      <span class="avatar" aria-hidden="true">{initialOf(ownerUsername)}</span
      ><span class="who"
        ><strong class="username">{ownerUsername}</strong><small class="meta"
          >Owner · always allowed</small
        ></span
      >
    </li>
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
  @use "../../../style/action-button" as action;

  .trakt-dev-access-panel {
    display: grid;
    gap: var(--ni-14);
    padding: var(--ni-28);
    border: var(--border-thickness-xxs) solid var(--color-border);
    border-radius: var(--radius-large);
    background: var(--color-surface);
    margin-block-end: var(--gap-l);
    min-width: 0;

    .panel-head {
      display: flex;
      justify-content: space-between;
      align-items: baseline;
      gap: var(--ni-10);
      flex-wrap: wrap;
    }

    .title {
      font-size: var(--ni-18);
      margin: 0;
    }

    .count {
      color: var(--color-muted);
      font-size: var(--ni-14);
      font-variant-numeric: tabular-nums;
    }

    .muted {
      margin: 0;
      color: var(--color-muted);
      line-height: 1.55;
    }

    .people {
      list-style: none;
      margin: 0;
      padding: 0;
      display: grid;
    }

    .person {
      display: flex;
      align-items: center;
      gap: var(--gap-s);
      min-block-size: var(--ni-52);
      padding-block: var(--ni-10);
      border-block-end: var(--border-thickness-xxs) solid var(--color-border);

      &:last-child {
        border-block-end: 0;
      }
    }

    .avatar {
      display: grid;
      place-items: center;
      flex: none;
      inline-size: var(--ni-32);
      block-size: var(--ni-32);
      border-radius: 50%;
      background: var(--color-surface-hover);
      color: var(--color-muted);
      font-size: var(--ni-14);
      font-weight: 700;
    }

    .who {
      display: grid;
      flex: 1;
      min-width: 0;
    }

    .username {
      display: block;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }

    .meta {
      color: var(--color-muted);
    }

    .remove {
      min-inline-size: var(--ni-44);
      min-block-size: var(--ni-44);
      padding-inline: var(--ni-12);
      border: var(--border-thickness-xxs) solid transparent;
      border-radius: var(--radius-control);
      background: transparent;
      color: var(--color-muted);
      font: inherit;
      font-size: var(--ni-14);
      cursor: pointer;

      &:hover:not(:disabled) {
        color: var(--color-danger);
      }
    }

    .error {
      margin: 0;
      color: var(--color-danger);
      font-size: var(--ni-14);
    }

    .add-row {
      display: flex;
      gap: var(--ni-10);
    }

    .username-input {
      flex: 1;
      min-width: 0;
      padding: var(--ni-12);
      border: var(--border-thickness-xxs) solid var(--color-border);
      background: var(--color-canvas);
    }

    .add-button {
      @include action.base;
    }

    @media (max-width: 900px) {
      padding: var(--ni-20);
    }
  }
</style>
