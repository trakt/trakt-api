<script lang="ts">
  import { DEFAULT_AVATAR } from "$lib/auth/DEFAULT_AVATAR.ts";
  import { onMount } from "svelte";
  import { signOutAccount } from "$lib/auth/signOutAccount.ts";
  import { signInAccount } from "$lib/auth/signInAccount.ts";
  import type { AccountMenuProps } from "./AccountMenuProps.ts";

  const {
    avatar,
    accounts,
    selectedSlot,
    onAccount,
    onLogout,
  }: AccountMenuProps = $props();

  let isOpen = $state(false);
  let failedAvatar = $state<string | null>(null);
  const avatarSource = $derived(avatar ?? DEFAULT_AVATAR);
  const avatarKey = $derived(`${selectedSlot}:${avatarSource}`);
  let selectorElement: HTMLDivElement;
  let isWorking = $state(false);
  let errors = $state<Record<number, string>>({});
  let connectError = $state("");
  let now = $state(Date.now());
  onMount(() => {
    const timer = setInterval(() => {
      now = Date.now();
    }, 1_000);
    return () => clearInterval(timer);
  });

  function tokenStatus(expiresAt: number, hasSessionError = false) {
    if (hasSessionError) return "error";
    return expiresAt * 1000 > now ? "valid" : "expired";
  }

  const statusLabels = {
    error: "Sign in again to reconnect this account",
    valid: "Session active",
    expired: "Session expired; automatic reconnection required",
  };
  const nextSlot = $derived(
    Array.from({ length: 5 }, (_, slot) => slot).find(
      (slot) => !accounts.some((account) => account.slot === slot),
    ) ?? null,
  );
  const selectedAccount = $derived(
    accounts.find((account) => account.slot === selectedSlot) ?? null,
  );
  const connectedAccounts = $derived(
    accounts.filter((account) => account.source === "developer-oauth"),
  );

  async function connectAccount(slot: number) {
    if (isWorking) return;
    isWorking = true;
    connectError = "";
    try {
      await signInAccount(slot);
    } catch {
      connectError = "Could not start sign-in. Try again.";
      isWorking = false;
    }
  }

  async function logOut(slot: number) {
    if (isWorking) return;
    isWorking = true;
    errors[slot] = "";
    try {
      await signOutAccount(slot);
      onLogout(slot);
    } catch {
      errors[slot] = "Could not log out. Try again.";
    } finally {
      isWorking = false;
    }
  }
</script>

{#snippet statusDot(expiresAt: number, hasSessionError = false)}
  {@const status = tokenStatus(expiresAt, hasSessionError)}
  <span
    class="status-dot"
    data-status={status}
    role="img"
    aria-label={statusLabels[status]}
    title={statusLabels[status]}
  ></span>
{/snippet}

<svelte:window
  onkeydown={(event) => {
    if (event.key === "Escape") isOpen = false;
  }}
  onpointerdown={(event) => {
    if (isOpen && !event.composedPath().includes(selectorElement))
      isOpen = false;
  }}
/>

<div class="trakt-account-menu" bind:this={selectorElement}>
  <button
    type="button"
    class="environment-trigger"
    aria-haspopup="dialog"
    aria-expanded={isOpen}
    onclick={() => {
      if (!accounts.length && nextSlot !== null) void connectAccount(nextSlot);
      else isOpen = !isOpen;
    }}
  >
    {#if selectedAccount}{#key avatarKey}<img
          class="avatar"
          src={failedAvatar === avatarKey ? DEFAULT_AVATAR : avatarSource}
          alt=""
          referrerpolicy="no-referrer"
          onerror={() => {
            failedAvatar = avatarKey;
          }}
        />{/key}{/if}
    <span class="trigger-copy"
      ><strong
        >{selectedAccount ? `@${selectedAccount.username}` : "Sign in"}</strong
      ></span
    >
  </button>

  {#if connectError && !isOpen}<p class="account-error" role="alert">
      {connectError}
    </p>{/if}

  {#if isOpen}
    <div class="environment-menu" role="dialog" aria-label="Trakt accounts">
      <div class="menu-heading">
        <strong>Trakt accounts</strong>
        <span
          >Connect your Trakt user account to test requests and manage your
          apps.</span
        >
      </div>

      {#if connectedAccounts.length > 0}
        <div class="connected-accounts">
          <span>Connected users</span>
          {#each connectedAccounts as account (account.slot)}
            <div>
              <button
                class="account-choice"
                class:is-selected={account.slot === selectedSlot}
                type="button"
                aria-pressed={account.slot === selectedSlot}
                onclick={() => onAccount(account.slot)}
              >
                {@render statusDot(account.expiresAt, account.hasSessionError)}
                <span>@{account.username}</span>
                {#if account.slot === selectedSlot}<span aria-hidden="true"
                    >✓</span
                  >{/if}
              </button>
              <div class="account-actions">
                <button
                  type="button"
                  aria-label={`${account.hasSessionError ? "Sign in again as" : "Log out"} @${account.username}`}
                  disabled={isWorking}
                  onclick={() =>
                    account.hasSessionError
                      ? connectAccount(account.slot)
                      : logOut(account.slot)}
                  >{account.hasSessionError
                    ? "Sign in again"
                    : "Log out"}</button
                >
              </div>
            </div>
            {#if account.hasSessionError}
              <p class="session-notice">
                We couldn’t reconnect this account. Sign in again to continue.
              </p>
            {/if}
            {#if errors[account.slot]}<p class="account-error" role="alert">
                {errors[account.slot]}
              </p>{/if}
          {/each}
        </div>
      {/if}

      {#if nextSlot !== null}
        <button
          type="button"
          class="add-account"
          disabled={isWorking}
          onclick={() => connectAccount(nextSlot)}
        >
          <span>＋</span>
          <span
            >{accounts.length === 0
              ? "Connect Trakt account"
              : "Add another account"}</span
          >
        </button>
      {/if}

      {#if connectError}<p class="account-error" role="alert">
          {connectError}
        </p>{/if}
    </div>
  {/if}
</div>

<style lang="scss">
  @use "../../../style/select-caret" as caret;

  .avatar {
    width: var(--ni-24);
    height: var(--ni-24);
    border-radius: 50%;
    object-fit: cover;
  }

  .trakt-account-menu {
    position: relative;

    .environment-trigger {
      display: flex;
      width: 100%;
      justify-content: space-between;
      align-items: center;
      gap: 8px;

      min-height: var(--ni-38);
      padding-inline: var(--ni-11);

      border: var(--ni-1) solid var(--color-border);
      border-radius: var(--radius-control);

      background: var(--color-surface-raised);
      text-align: start;
    }

    .environment-trigger::after {
      flex: 0 0 auto;

      @include caret.base;
    }

    .trigger-copy {
      display: grid;
      min-width: 0;
      gap: var(--ni-1);
    }

    .trigger-copy strong {
      max-width: 150px;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      font-size: var(--ni-11);
    }

    .environment-menu {
      position: absolute;
      z-index: 30;
      inset-block-start: calc(100% + 8px);
      inset-inline-end: 0;

      width: min(410px, calc(100vw - var(--ni-24)));
      max-height: calc(100dvh - 150px);
      overflow-y: auto;
      padding: 8px;

      border: var(--ni-1) solid var(--color-border-strong);
      border-radius: var(--radius-large);

      background: var(--color-surface-raised);
      box-shadow: var(--shadow-popover);
    }

    .menu-heading {
      display: grid;
      gap: var(--ni-3);

      padding: 9px var(--ni-10) var(--ni-11);
      border-block-end: var(--ni-1) solid var(--color-border);
    }

    .menu-heading strong {
      font-size: 13px;
    }

    .menu-heading span {
      color: var(--color-muted);
      font-size: var(--ni-11);
    }

    .status-dot {
      display: inline-block;
      width: 7px;
      height: 7px;
      flex: 0 0 auto;

      border-radius: 50%;
      background: var(--color-success);
    }

    .status-dot[data-status="expired"] {
      background: var(--color-warning);
    }

    .status-dot[data-status="error"] {
      background: var(--color-danger);
    }

    .account-choice {
      display: flex;
      align-items: center;
      gap: 7px;
      min-width: 0;
      flex: 1;

      padding: 8px;
      border: var(--ni-1) solid transparent;
      border-radius: var(--radius-control);

      background: transparent;
      text-align: start;
    }

    .account-choice span:not(.status-dot) {
      overflow: hidden;
      text-overflow: ellipsis;
    }

    .account-choice.is-selected {
      background: var(--color-surface);
      border-color: var(--color-border-strong);
    }

    .session-notice {
      margin: 0;
      padding-inline: var(--ni-8);
      color: var(--color-muted);
      font-size: var(--ni-11);
    }

    .account-error {
      margin: 0 0 8px;
      color: var(--color-danger);
      font-size: var(--ni-11);
    }

    .connected-accounts {
      display: grid;
      gap: var(--ni-4);

      padding: 9px;
      border-block-start: var(--ni-1) solid var(--color-border);
    }

    .connected-accounts > span {
      color: var(--color-subtle);
      font-size: 9px;
      letter-spacing: 0.05em;
      text-transform: uppercase;
    }

    .connected-accounts > div {
      display: flex;
      align-items: center;
      justify-content: space-between;

      color: var(--color-muted);
      font-size: var(--ni-11);
    }

    .account-actions {
      display: flex;
      padding-inline-start: 8px;
    }

    .account-actions button {
      min-width: var(--ni-28);
      height: var(--ni-28);

      border: 0;
      border-radius: var(--radius-small);

      background: transparent;
      color: var(--color-muted);
    }

    .account-actions button:hover {
      background: var(--color-border);
      color: var(--color-foreground);
    }

    .add-account {
      display: flex;
      align-items: center;
      gap: 9px;

      width: 100%;
      padding: var(--ni-10);
      border: 0;
      border-block-start: var(--ni-1) solid var(--color-border);

      background: transparent;
      color: var(--color-info);
      font-family: inherit;
      font-size: var(--ni-12);
      text-align: start;
      text-decoration: none;
    }

    .add-account:disabled {
      color: var(--color-muted);
    }
  }

  @media (max-width: 640px) {
    .trakt-account-menu .environment-menu {
      position: fixed;
      inset-inline: var(--ni-12);
      inset-block-start: 56px;
      width: auto;
    }
  }
</style>
