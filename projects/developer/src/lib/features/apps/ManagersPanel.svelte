<script lang="ts">
  import { onMount } from "svelte";
  import { addManager } from "./addManager.ts";
  import type { AppManager } from "./AppManager.ts";
  import { formatDate } from "./formatDate.ts";
  import { listManagers } from "./listManagers.ts";
  import type { ManagersPanelProps } from "./ManagersPanelProps.ts";
  import { removeManager } from "./removeManager.ts";

  const {
    slot,
    appId,
    ownerUsername,
    isOwner,
    onCountChange,
  }: ManagersPanelProps = $props();

  let managers = $state<AppManager[]>([]);
  let loading = $state(true);
  let busy = $state(false);
  let error = $state("");
  let username = $state("");
  let alive = true;

  onMount(() => {
    void load();
    return () => {
      alive = false;
    };
  });

  function initialOf(name: string): string {
    return name.trim().charAt(0).toUpperCase();
  }

  function update(next: AppManager[]) {
    managers = next;
    onCountChange(next.length);
  }

  async function load() {
    try {
      const list = await listManagers(slot, appId);
      if (alive) update(list);
    } catch (cause) {
      if (alive)
        error =
          cause instanceof Error
            ? cause.message
            : "The managers could not be read.";
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
      await addManager(slot, appId, target);
      if (!alive) return;
      username = "";
      await load();
    } catch (cause) {
      if (alive)
        error =
          cause instanceof Error
            ? cause.message
            : "Could not add this manager.";
    } finally {
      if (alive) busy = false;
    }
  }

  async function remove(entry: AppManager) {
    if (busy) return;
    busy = true;
    error = "";
    try {
      await removeManager(slot, appId, entry.user.ids.slug);
      if (!alive) return;
      update(
        managers.filter(
          (manager) => manager.user.ids.slug !== entry.user.ids.slug,
        ),
      );
    } catch (cause) {
      if (alive)
        error =
          cause instanceof Error
            ? cause.message
            : "Could not remove this manager.";
    } finally {
      if (alive) busy = false;
    }
  }
</script>

<section class="trakt-managers-panel" aria-labelledby="managers-title">
  <div class="panel-head">
    <h2 class="title" id="managers-title">Managers</h2>
    {#if !loading}<span class="count">{managers.length}</span>{/if}
  </div>
  <p class="muted">
    {isOwner
      ? "Managers can edit this app and its sign-in list. Only you can delete it or change who manages it."
      : "Managers can edit this app and its sign-in list."}
  </p>
  <ul class="people" aria-busy={loading}>
    <li class="person">
      <span class="avatar" aria-hidden="true">{initialOf(ownerUsername)}</span
      ><span class="who"
        ><strong class="username">{ownerUsername}</strong><small class="meta"
          >Owner</small
        ></span
      >
    </li>
    {#each managers as entry (entry.user.ids.slug)}
      <li class="person">
        <span class="avatar" aria-hidden="true"
          >{initialOf(entry.user.username)}</span
        ><span class="who"
          ><strong class="username">{entry.user.username}</strong><small
            class="meta">Added {formatDate(entry.added_at)}</small
          ></span
        >{#if isOwner}<button
            class="remove"
            disabled={busy}
            aria-label={`Remove ${entry.user.username}`}
            onclick={() => remove(entry)}>Remove</button
          >{/if}
      </li>
    {/each}
  </ul>
  {#if error}<p class="error" role="alert">{error}</p>{/if}
  {#if isOwner}<form class="add-row" onsubmit={add}>
      <input
        class="username-input"
        bind:value={username}
        placeholder="Trakt username"
        aria-label="Trakt username"
        autocomplete="off"
        spellcheck="false"
        disabled={busy}
      /><button
        class="add-button"
        type="submit"
        disabled={busy || !username.trim()}
        aria-busy={busy}>Add</button
      >
    </form>{:else}<p class="owner-note">
      Only the owner can add or remove managers.
    </p>{/if}
</section>

<style lang="scss">
  @use "../../../style/member-panel" as panel;

  .trakt-managers-panel {
    @include panel.member-panel;

    .owner-note {
      margin: 0;
      color: var(--color-muted);
      font-size: var(--ni-14);
    }
  }
</style>
