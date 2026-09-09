<script lang="ts">
  import LoadingSpinner from "./LoadingSpinner.svelte";
  import { formatTokenValidity } from "./formatTokenValidity.ts";
  import { onMount } from "svelte";
  import { mutateAccount } from "$lib/api/mutateAccount.ts";
  import type { EnvironmentSelectorProps } from "./EnvironmentSelectorProps.ts";

  const {
    accounts,
    selectedSlot,
    serverUrl,
    servers,
    onServer,
    onAccount,
    onAccountsChanged,
    onLogout,
  }: EnvironmentSelectorProps = $props();

  let isOpen = $state(false);
  let selectorElement: HTMLDivElement;
  let isWorking = $state(false);
  let refreshingSlot = $state<number | null>(null);
  let errors = $state<Record<number, string>>({});
  let refreshFailures = $state<Record<number, boolean>>({});
  let now = $state(Date.now());
  onMount(() => {
    const timer = setInterval(() => {
      now = Date.now();
    }, 1_000);
    return () => clearInterval(timer);
  });

  function tokenStatus(slot: number, expiresAt: number) {
    if (refreshFailures[slot]) return "error";
    return expiresAt * 1000 > now ? "valid" : "expired";
  }

  const statusLabels = {
    valid: "Access token has not expired",
    expired: "Access token expired; refresh required",
    error: "Access token refresh failed",
  };
  const nextSlot = $derived(
    Array.from({ length: 5 }, (_, slot) => slot).find(
      (slot) => !accounts.some((account) => account.slot === slot),
    ) ?? null,
  );
  const selectedAccount = $derived(
    accounts.find((account) => account.slot === selectedSlot) ?? null,
  );
  const selectedServer = $derived(
    servers.find((server) => server.url === serverUrl) ?? servers.at(0),
  );
  const connectedAccounts = $derived(
    accounts.filter((account) => account.source === "developer-oauth"),
  );

  async function updateAccount(slot: number, method: "POST" | "DELETE") {
    if (isWorking) return;
    isWorking = true;
    refreshingSlot = method === "POST" ? slot : null;
    errors[slot] = "";
    try {
      await mutateAccount(slot, method);
      if (method === "DELETE") {
        onLogout(slot);
        return;
      }

      refreshFailures[slot] = false;
      await onAccountsChanged();
      now = Date.now();
    } catch (error) {
      errors[slot] =
        error instanceof Error
          ? error.message
          : "Could not update account. Try again.";
      if (method === "POST") refreshFailures[slot] = true;
    } finally {
      isWorking = false;
      refreshingSlot = null;
    }
  }
</script>

{#snippet statusDot(slot: number, expiresAt: number)}
  {@const status = tokenStatus(slot, expiresAt)}
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

<div class="trakt-environment-selector" bind:this={selectorElement}>
  <button
    type="button"
    class="environment-trigger"
    aria-haspopup="dialog"
    aria-expanded={isOpen}
    onclick={() => (isOpen = !isOpen)}
  >
    <span class="trigger-copy">
      <strong>Environment</strong>
      <small>
        {selectedServer?.label ?? "Public"} ·
        {#if selectedAccount}{@render statusDot(
            selectedAccount.slot,
            selectedAccount.expiresAt,
          )}{/if}
        {selectedAccount ? `@${selectedAccount.username}` : "No user"}
      </small>
    </span>
  </button>

  {#if isOpen}
    <div
      class="environment-menu"
      role="dialog"
      aria-label="Request environment"
    >
      <div class="menu-heading">
        <strong>Request environment</strong>
        <span>Choose the API server and connected user.</span>
      </div>

      <div class="environment-fields">
        <label class="environment-field">
          <span class="field-copy">
            <strong>Server base URL</strong>
            <small>Public or premium Trakt API</small>
          </span>
          <span class="select-control">
            <select
              aria-label="Server base URL"
              value={serverUrl}
              onchange={(event) => onServer(event.currentTarget.value)}
            >
              {#each servers as server (server.url)}
                <option value={server.url}
                  >{server.label} — {server.host}</option
                >
              {/each}
            </select>
          </span>
        </label>
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
                {@render statusDot(account.slot, account.expiresAt)}
                <span>@{account.username}</span>
                {#if account.slot === selectedSlot}<span aria-hidden="true"
                    >✓</span
                  >{/if}
              </button>
              <div class="account-actions">
                <span class="token-info">
                  <button
                    type="button"
                    class="info-button"
                    aria-label={`Access token validity for @${account.username}`}
                    aria-describedby={`token-validity-${account.slot}`}
                    >i</button
                  >
                  <span
                    class="token-tooltip"
                    role="tooltip"
                    id={`token-validity-${account.slot}`}
                  >
                    Access token: {formatTokenValidity(account.expiresAt, now)}
                    {#if account.expiresAt * 1000 > now}
                      remaining{/if}
                  </span>
                </span>
                <button
                  type="button"
                  aria-label={`${refreshingSlot === account.slot ? "Refreshing" : "Refresh"} @${account.username}`}
                  aria-busy={refreshingSlot === account.slot}
                  disabled={isWorking}
                  onclick={() => updateAccount(account.slot, "POST")}
                >
                  {#if refreshingSlot === account.slot}
                    <LoadingSpinner />
                  {:else}
                    ↻
                  {/if}
                </button>
                <button
                  type="button"
                  aria-label={`Log out @${account.username}`}
                  disabled={isWorking}
                  onclick={() => updateAccount(account.slot, "DELETE")}
                  >×</button
                >
              </div>
            </div>
            {#if errors[account.slot]}<p class="account-error" role="alert">
                {errors[account.slot]}
              </p>{/if}
          {/each}
        </div>
      {/if}

      {#if nextSlot !== null}
        <a href={`/auth/login?slot=${nextSlot}`} class="add-account">
          <span>＋</span>
          <span
            >{accounts.length === 0
              ? "Connect Trakt account"
              : "Add another account"}</span
          >
        </a>
      {/if}
    </div>
  {/if}
</div>

<style lang="scss">
  .trakt-environment-selector {
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
      width: 7px;
      height: var(--ni-4);
      flex: 0 0 auto;

      background: var(--color-muted);
      clip-path: polygon(0 0, 100% 0, 50% 100%);
      content: "";
    }

    .trigger-copy {
      display: grid;
      min-width: 0;
      gap: var(--ni-1);
    }

    .trigger-copy strong {
      font-size: var(--ni-11);
    }

    .trigger-copy small {
      display: flex;
      align-items: center;
      gap: var(--ni-6);

      overflow: hidden;
      max-width: 230px;

      color: var(--color-muted);
      font-size: 9px;
      text-overflow: ellipsis;
      white-space: nowrap;
    }

    .environment-menu {
      position: absolute;
      z-index: 30;
      inset-block-end: calc(100% + 8px);
      inset-inline-start: 0;

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

    .environment-fields {
      display: grid;
      gap: var(--ni-2);
      padding-block: 7px;
    }

    .environment-field {
      display: grid;
      grid-template-columns: 130px minmax(0, 1fr);
      align-items: center;
      gap: var(--ni-10);
      padding: 8px 9px;
    }

    .field-copy {
      display: grid;
      gap: var(--ni-2);
    }

    .field-copy strong {
      font-size: var(--ni-11);
    }

    .field-copy small {
      color: var(--color-subtle);
      font-size: 9px;
      line-height: 1.35;
    }

    .select-control {
      position: relative;
      min-width: 0;
    }

    .select-control::after {
      position: absolute;
      inset-block-start: 50%;
      inset-inline-end: var(--ni-10);

      width: 7px;
      height: var(--ni-4);

      background: var(--color-muted);
      clip-path: polygon(0 0, 100% 0, 50% 100%);
      content: "";

      pointer-events: none;
      transform: translateY(-50%);
    }

    .select-control select {
      width: 100%;
      height: 35px;
      padding-inline: 9px var(--ni-28);

      border: var(--ni-1) solid var(--color-border);
      border-radius: var(--radius-control);

      background-color: var(--color-surface);
      font-size: var(--ni-10);
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

    .token-info {
      position: relative;
      display: inline-flex;
    }

    .token-tooltip {
      position: absolute;
      z-index: 1;
      inset-block-end: calc(100% + var(--ni-8));
      inset-inline-end: 0;

      width: max-content;
      max-width: 230px;
      padding: 7px 9px;
      border: var(--ni-1) solid var(--color-border-strong);
      border-radius: var(--radius-control);

      background: var(--color-surface);
      color: var(--color-foreground);
      box-shadow: var(--shadow-popover);
      font-size: var(--ni-11);

      pointer-events: none;
      visibility: hidden;
    }

    .token-info:hover .token-tooltip,
    .token-info:focus-within .token-tooltip {
      visibility: visible;
    }

    .account-actions button {
      width: var(--ni-28);
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

      padding: var(--ni-10);
      border-block-start: var(--ni-1) solid var(--color-border);

      color: var(--color-info);
      font-size: var(--ni-12);
      text-decoration: none;
    }
  }
</style>
