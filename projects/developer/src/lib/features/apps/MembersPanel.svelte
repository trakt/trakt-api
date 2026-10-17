<script lang="ts">
  import { onMount } from "svelte";
  import { addMember } from "./addMember.ts";
  import type { AppMember } from "./AppMember.ts";
  import type { AppMemberRole } from "./AppMemberRole.ts";
  import { changeMemberRole } from "./changeMemberRole.ts";
  import { formatDate } from "./formatDate.ts";
  import { listMembers } from "./listMembers.ts";
  import type { MembersPanelProps } from "./MembersPanelProps.ts";
  import { removeMember } from "./removeMember.ts";

  const {
    slot,
    appId,
    dev,
    isOwner,
    ownerUsername,
    onCountChange,
  }: MembersPanelProps = $props();

  let members = $state<AppMember[]>([]);
  let seatLimit = $state(0);
  let loading = $state(true);
  let busy = $state(false);
  let error = $state("");
  let username = $state("");
  // svelte-ignore state_referenced_locally
  let newRole = $state<AppMemberRole>(dev ? "tester" : "manager");
  let alive = true;

  const target = $derived({ slot, appId });
  const seatsUsed = $derived(1 + members.length);
  const full = $derived(dev && !loading && seatsUsed >= seatLimit);
  const roles = $derived<AppMemberRole[]>(
    dev ? ["tester", "manager"] : ["manager"],
  );

  onMount(() => {
    void load();
    return () => {
      alive = false;
    };
  });

  function initialOf(name: string): string {
    return name.trim().charAt(0).toUpperCase();
  }

  function roleLabel(role: AppMemberRole): string {
    return role === "manager" ? "Manager" : "Tester";
  }

  function canRemove(member: AppMember): boolean {
    return isOwner || member.role === "tester";
  }

  async function load() {
    try {
      const result = await listMembers(slot, appId, dev);
      if (!alive) return;
      members = result.members;
      seatLimit = result.seatLimit;
      onCountChange(result.members.length);
    } catch (cause) {
      if (alive)
        error =
          cause instanceof Error
            ? cause.message
            : "The members could not be read.";
    } finally {
      if (alive) loading = false;
    }
  }

  async function run(action: () => Promise<void>, fallback: string) {
    if (busy) return;
    busy = true;
    error = "";
    try {
      await action();
      if (alive) await load();
    } catch (cause) {
      if (alive) error = cause instanceof Error ? cause.message : fallback;
    } finally {
      if (alive) busy = false;
    }
  }

  function add(event: SubmitEvent) {
    event.preventDefault();
    const name = username.trim();
    if (!name) return;
    void run(async () => {
      await addMember(target, name, isOwner ? newRole : "tester");
      username = "";
    }, "Could not add this person.");
  }
</script>

<section class="trakt-members-panel" aria-labelledby="members-title">
  <div class="panel-head">
    <h2 class="title" id="members-title">Members</h2>
    {#if !loading}<span class="count"
        >{dev ? `${seatsUsed} of ${seatLimit}` : members.length}</span
      >{/if}
  </div>
  <p class="muted">
    {dev
      ? "Managers edit this app and its members. Testers can only sign in."
      : "Managers edit this app and its members."}
  </p>
  <ul class="people" aria-busy={loading}>
    <li class="person">
      <span class="avatar" aria-hidden="true">{initialOf(ownerUsername)}</span
      ><span class="who"
        ><strong class="username">{ownerUsername}</strong><small class="meta"
          >Always allowed</small
        ></span
      ><span class="controls"><span class="role-fixed">Owner</span></span>
    </li>
    {#each members as member (member.slug)}
      <li class="person">
        <span class="avatar" aria-hidden="true"
          >{initialOf(member.username)}</span
        ><span class="who"
          ><strong class="username">{member.username}</strong><small
            class="meta">Added {formatDate(member.addedAt)}</small
          ></span
        ><span class="controls"
          >{#if isOwner && roles.length > 1}<span class="role-control"
              ><select
                class="role-select"
                aria-label={`Role for ${member.username}`}
                value={member.role}
                disabled={busy}
                onchange={(event) =>
                  run(
                    () =>
                      changeMemberRole(
                        target,
                        member,
                        event.currentTarget.value as AppMemberRole,
                      ),
                    "Could not change this role.",
                  )}
                >{#each roles as role (role)}<option value={role}
                    >{roleLabel(role)}</option
                  >{/each}</select
              ></span
            >{:else}<span class="role-fixed">{roleLabel(member.role)}</span
            >{/if}{#if canRemove(member)}<button
              class="remove"
              disabled={busy}
              aria-label={`Remove ${member.username}`}
              onclick={() =>
                run(
                  () => removeMember(target, member),
                  "Could not remove this person.",
                )}>Remove</button
            >{/if}</span
        >
      </li>
    {/each}
  </ul>
  {#if error}<p class="error" role="alert">{error}</p>{/if}
  {#if isOwner || dev}<form class="add-row" onsubmit={add}>
      <input
        class="username-input"
        bind:value={username}
        placeholder="Trakt username"
        aria-label="Trakt username"
        autocomplete="off"
        spellcheck="false"
        disabled={busy || full}
      />{#if isOwner && roles.length > 1}<span class="role-control"
          ><select
            class="role-select"
            aria-label="Role"
            bind:value={newRole}
            disabled={busy || full}
            >{#each roles as role (role)}<option value={role}
                >{roleLabel(role)}</option
              >{/each}</select
          ></span
        >{/if}<button
        class="add-button"
        type="submit"
        disabled={busy || full || !username.trim()}
        aria-busy={busy}>Add</button
      >
    </form>{/if}
  {#if !isOwner}<p class="owner-note">
      {dev
        ? "Only the owner can change roles or remove managers. You can add and remove testers."
        : "Only the owner can add or remove managers."}
    </p>{/if}
</section>

<style lang="scss">
  @use "../../../style/member-panel" as panel;
  @use "../../../style/select-caret" as caret;

  .trakt-members-panel {
    @include panel.member-panel;

    .controls {
      display: flex;
      flex: none;
      align-items: center;
      gap: var(--gap-xs);
      margin-inline-start: auto;
    }

    .role-fixed {
      flex: none;
      min-inline-size: var(--ni-80);
      color: var(--color-muted);
      font-size: var(--ni-14);
      text-align: end;
    }

    .role-control {
      position: relative;
      flex: none;

      &::after {
        position: absolute;
        inset-block-start: 50%;
        inset-inline-end: var(--ni-12);

        @include caret.base;

        pointer-events: none;
      }
    }

    .role-select {
      block-size: var(--ni-40);
      padding-inline: var(--ni-12) var(--ni-30);
      border: var(--border-thickness-xxs) solid var(--color-border);
      border-radius: var(--radius-control);
      background: var(--color-canvas);
      color: var(--color-foreground);
      font: inherit;
      font-size: var(--ni-14);
      cursor: pointer;
    }

    .owner-note {
      margin: 0;
      color: var(--color-muted);
      font-size: var(--ni-14);
    }

    @media (max-width: 700px) {
      .person,
      .add-row {
        flex-wrap: wrap;
      }

      .person:has(.role-control) .who {
        flex-basis: calc(100% - var(--ni-32) - var(--gap-s));
      }

      .username-input {
        flex-basis: 100%;
      }
    }
  }
</style>
