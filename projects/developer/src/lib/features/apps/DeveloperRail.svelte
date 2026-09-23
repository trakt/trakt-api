<script lang="ts">
  import GithubMark from "./GithubMark.svelte";
  import type { DeveloperProfile } from "./developerProfile.ts";
  import type { GithubConnectIntent } from "./githubConnect.ts";

  const {
    profile,
    busy,
    error = "",
    onConnect,
    onUnlink,
  }: {
    profile: DeveloperProfile | null;
    busy: boolean;
    error?: string;
    onConnect: (intent: GithubConnectIntent) => void;
    onUnlink: () => void;
  } = $props();

  let switching = $state(false);
  let unlinking = $state(false);
  let confirmation = $state("");

  const github = $derived(profile?.github ?? null);
  const appCount = $derived(profile?.applications.count ?? 0);
  const hasLegacyApps = $derived(!github && appCount > 0);
  const appsLabel = $derived(appCount === 1 ? "1 app" : `${appCount} apps`);
  const atLimit = $derived(
    !!profile && profile.applications.count >= profile.applications.limit,
  );

  function cancelUnlink() {
    unlinking = false;
    confirmation = "";
  }
</script>

<aside
  class="rail"
  class:attention={hasLegacyApps}
  aria-label="Developer account"
>
  <span class="eyebrow">Developer</span>
  {#if error}<p class="rail-error" role="alert">{error}</p>{/if}
  {#if !profile}
    <p role="status">Loading your developer account…</p>
  {:else if github}
    <div class="identity">
      <span class="avatar"><GithubMark /></span>
      <div class="handle">
        <strong>@{github.username}</strong>
        <span class="pill verified">Verified</span>
      </div>
    </div>
    <p class="meta">
      GitHub id {github.id}{#if github.linked_at}
        · Linked {new Date(github.linked_at).toLocaleDateString()}{/if}
    </p>
    {#if atLimit}<span class="pill attention">App limit reached</span>{/if}
    {#if switching}
      <p>
        Sign in to GitHub with the account you want to use. Signing in with the
        same account refreshes your username. Your apps stay exactly as they
        are.
      </p>
      <div class="actions">
        <button
          class="primary"
          disabled={busy}
          onclick={() => onConnect("switch")}>Continue to GitHub</button
        ><button disabled={busy} onclick={() => (switching = false)}
          >Cancel</button
        >
      </div>
    {:else}
      <button disabled={busy} onclick={() => (switching = true)}
        >Switch GitHub account</button
      >
    {/if}
    <hr />
    {#if unlinking}
      <p>
        This permanently deletes {appsLabel} and revokes {appCount === 1
          ? "its"
          : "their"} credentials. Every user connected to {appCount === 1
          ? "it"
          : "them"} is signed out.
      </p>
      <label
        >Type <strong>{github.username}</strong> to confirm<input
          bind:value={confirmation}
          disabled={busy}
          autocomplete="off"
          spellcheck="false"
        /></label
      >
      <div class="actions">
        <button
          class="destructive"
          disabled={busy || confirmation !== github.username}
          onclick={onUnlink}
          >{busy ? "Unlinking…" : "Unlink and delete apps"}</button
        ><button disabled={busy} onclick={cancelUnlink}>Cancel</button>
      </div>
    {:else}
      <button
        class="destructive"
        disabled={busy}
        onclick={() => (unlinking = true)}>Unlink and delete apps</button
      >
    {/if}
  {:else}
    <span class="avatar"><GithubMark /></span>
    {#if hasLegacyApps}<span class="pill attention">Action needed</span>{/if}
    <strong class="state">Not connected</strong>
    <p>
      {hasLegacyApps
        ? `Your ${appsLabel} keep working. Connect GitHub to create more.`
        : "Link GitHub once to create apps. Every app you make afterwards uses it."}
    </p>
    <button class="primary" disabled={busy} onclick={() => onConnect("link")}
      >Connect GitHub</button
    >
    <p class="fine">
      We only read your public GitHub username and id. No repository or email
      access.
    </p>
  {/if}
</aside>

<style lang="scss">
  @use "../../../style/action-button" as action;
  .rail {
    display: grid;
    gap: 16px;
    align-content: start;
    padding: 24px;
    border: 1px solid var(--color-border);
    border-radius: var(--radius-large);
    background: var(--color-surface);
  }
  .rail.attention {
    border-color: color-mix(
      in srgb,
      var(--color-warning) 40%,
      var(--color-border)
    );
  }
  .rail-error {
    padding: 10px 12px;
    border-radius: var(--radius-control);
    border: 1px solid
      color-mix(in srgb, var(--color-danger) 35%, var(--color-border));
    background: color-mix(in srgb, var(--color-danger) 10%, transparent);
    color: var(--color-danger);
  }
  .eyebrow {
    font-size: 11px;
    font-weight: 700;
    letter-spacing: 0.08em;
    text-transform: uppercase;
    color: var(--color-muted);
  }
  .identity {
    display: flex;
    align-items: center;
    gap: 14px;
  }
  .avatar {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 52px;
    height: 52px;
    border-radius: 50%;
    background: var(--color-surface-raised);
    border: 1px solid var(--color-border);
    color: var(--color-foreground);
  }
  .handle {
    display: grid;
    gap: 6px;
    justify-items: start;
    min-width: 0;
  }
  .handle strong {
    font-size: 16px;
    overflow-wrap: anywhere;
  }
  .state {
    font-size: 16px;
  }
  .pill {
    font-size: 11px;
    font-weight: 600;
    padding: 4px 9px;
    border-radius: 20px;
    justify-self: start;
  }
  .verified {
    color: var(--color-success);
    background: color-mix(in srgb, var(--color-success) 12%, transparent);
  }
  .pill.attention {
    color: var(--color-warning);
    background: color-mix(in srgb, var(--color-warning) 12%, transparent);
  }
  p {
    margin: 0;
    color: var(--color-muted);
    font-size: 13px;
    line-height: 1.6;
  }
  .meta {
    font-size: 12px;
  }
  .fine {
    font-size: 12px;
  }
  hr {
    width: 100%;
    border: 0;
    border-top: 1px solid var(--color-border);
    margin: 0;
  }
  label {
    display: grid;
    gap: 8px;
    font-size: 13px;
  }
  input {
    padding: 10px;
    border: 1px solid var(--color-border);
    background: var(--color-canvas);
  }
  .actions {
    display: flex;
    flex-wrap: wrap;
    gap: 10px;
  }
  button {
    @include action.base;
  }
  .primary {
    @include action.primary;
  }
  .destructive {
    color: var(--color-danger);
  }
</style>
