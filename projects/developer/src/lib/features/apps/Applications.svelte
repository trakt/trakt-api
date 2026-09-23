<script lang="ts">
  import { applicationCrumb, applicationTitle } from "./applicationTitle.ts";
  import { applicationPermissionLabels } from "./applicationPermissionLabels.ts";
  import { applicationUrl } from "./applicationUrl.ts";
  import { formatDate } from "./formatDate.ts";
  import { goto } from "$app/navigation";
  import { onMount } from "svelte";
  import ApplicationForm from "./ApplicationForm.svelte";
  import DeveloperRail from "./DeveloperRail.svelte";
  import {
    listApplications,
    saveApplication,
    deleteApplication,
    type Application,
    type ApplicationInput,
  } from "./applications.ts";
  import type { ApplicationsProps } from "./ApplicationsProps.ts";
  import {
    getDeveloperProfile,
    linkGithub,
    unlinkGithub,
    type DeveloperProfile,
  } from "./developerProfile.ts";
  import {
    completeGithubConnect,
    githubConnectUrl,
    isGithubCallback,
    type GithubConnectIntent,
  } from "./githubConnect.ts";

  const { slot, mode, appId, appName }: ApplicationsProps = $props();
  let loading = $state(true);
  let apps = $state<Application[]>([]);
  let profile = $state<DeveloperProfile | null>(null);
  const selected = $derived(apps.find((app) => app.id === appId));

  function canCreateWith(developer: DeveloperProfile | null): boolean {
    return (
      !!developer?.github &&
      developer.applications.count < developer.applications.limit
    );
  }

  const canCreate = $derived(canCreateWith(profile));
  const readOnly = $derived(!!profile && !profile.github);
  const createLock = $derived(
    !profile
      ? "Loading…"
      : !profile.github
        ? "Connect GitHub first"
        : "App limit reached",
  );
  const displayName = $derived(
    selected?.name ?? appName ?? (loading ? "Loading…" : "App details"),
  );
  const title = $derived(applicationTitle(mode, displayName));
  const details = $derived(
    selected
      ? [
          { label: "App name", value: selected.name, code: false },
          {
            label: "Description",
            value: selected.description || "No description yet.",
            code: false,
          },
          { label: "Redirect URIs", value: selected.redirect_uri, code: true },
          {
            label: "Allowed origins",
            value: selected.origins.join("\n") || "No origins configured",
            code: true,
          },
        ]
      : [],
  );
  const credentials = $derived(
    selected
      ? [
          { label: "Client ID", value: selected.client_id, secret: false },
          {
            label: "Client Secret",
            value: selected.client_secret,
            secret: true,
          },
        ]
      : [],
  );
  let busy = $state(false);
  let error = $state("");
  let railError = $state("");
  let notice = $state("");
  let reveal = $state(false);
  let confirming = $state(false);
  let confirmation = $state("");
  let alive = true;

  onMount(() => {
    void start();
    return () => {
      alive = false;
    };
  });

  async function start() {
    if (mode === "new") return guardCreate();
    const connectError = mode === "list" ? await finishGithubConnect() : null;
    await load();
    if (!alive) return;
    if (connectError) railError = connectError;
    if (mode === "edit" && readOnly) {
      await goto(
        applicationUrl({ id: appId, name: selected?.name ?? appName }),
        { replaceState: true },
      );
    }
  }

  async function guardCreate() {
    try {
      const developer = await getDeveloperProfile(slot);
      if (!alive) return;
      if (!canCreateWith(developer)) {
        await goto("/apps", { replaceState: true });
        return;
      }
      profile = developer;
    } catch (cause) {
      if (alive)
        error =
          cause instanceof Error
            ? cause.message
            : "Could not load your developer account.";
    } finally {
      if (alive) loading = false;
    }
  }

  async function finishGithubConnect(): Promise<string | null> {
    const params = new URL(globalThis.location.href).searchParams;
    if (!isGithubCallback(params)) return null;
    const outcome = completeGithubConnect(params);
    globalThis.history.replaceState(globalThis.history.state, "", "/apps");
    if (outcome.status === "denied") {
      return "You did not authorize the GitHub connection. Connect again when you are ready.";
    }
    if (outcome.status === "invalid") {
      return "This GitHub connection could not be verified. Connect again.";
    }
    try {
      await linkGithub(slot, outcome.code, outcome.allowSwitch);
      if (alive)
        notice = outcome.allowSwitch
          ? "GitHub account updated."
          : "GitHub connected.";
      return null;
    } catch (cause) {
      return cause instanceof Error
        ? cause.message
        : "Could not connect GitHub.";
    }
  }

  function connect(intent: GithubConnectIntent) {
    globalThis.location.assign(githubConnectUrl(intent));
  }

  async function unlink() {
    if (busy) return;
    busy = true;
    railError = "";
    notice = "";
    try {
      await unlinkGithub(slot);
      if (!alive) return;
      apps = [];
      profile = profile && {
        github: null,
        applications: { ...profile.applications, count: 0 },
      };
      notice = "GitHub unlinked. Your apps were deleted.";
      await load();
    } catch (cause) {
      if (alive)
        railError =
          cause instanceof Error ? cause.message : "Could not unlink GitHub.";
    } finally {
      if (alive) busy = false;
    }
  }

  async function load() {
    loading = true;
    error = "";
    const [result, developer] = await Promise.allSettled([
      listApplications(slot),
      getDeveloperProfile(slot),
    ]);
    if (!alive) return;
    if (result.status === "fulfilled") apps = result.value;
    if (developer.status === "fulfilled") profile = developer.value;
    const failure = [result, developer].find(
      (outcome) => outcome.status === "rejected",
    );
    if (failure)
      error =
        failure.reason instanceof Error
          ? failure.reason.message
          : "Could not load your apps.";
    loading = false;
  }

  async function save(input: ApplicationInput) {
    if (busy || (mode === "edit" && !selected)) return;
    busy = true;
    error = "";
    try {
      const saved = await saveApplication(
        slot,
        input,
        mode === "edit" ? selected?.id : undefined,
      );
      if (!alive) return;
      const id = saved?.id ?? (mode === "edit" ? selected?.id : undefined);
      await goto(applicationUrl({ id, name: saved?.name ?? input.name }), {
        replaceState: true,
      });
    } catch (cause) {
      if (alive)
        error =
          cause instanceof Error ? cause.message : "Could not save your app.";
    } finally {
      if (alive) busy = false;
    }
  }

  async function remove() {
    if (!selected || busy || confirmation !== selected.name) return;
    busy = true;
    error = "";
    try {
      await deleteApplication(slot, selected.id);
      if (!alive) return;
      await goto("/apps", { replaceState: true });
    } catch (cause) {
      if (alive)
        error =
          cause instanceof Error ? cause.message : "Could not delete your app.";
    } finally {
      if (alive) busy = false;
    }
  }

  async function copy(value: string, label: string) {
    try {
      await navigator.clipboard.writeText(value);
      if (alive) notice = `${label} copied.`;
    } catch {
      if (alive) error = "Could not copy. Select and copy the value manually.";
    }
  }
</script>

<svelte:head><title>{title} | Trakt Developer</title></svelte:head>

<div class="trakt-applications">
  <div class="content">
    <header>
      <div>
        <nav class="breadcrumbs" aria-label="Breadcrumb">
          {#if mode === "list"}<span aria-current="page">My Apps</span>
          {:else}<a href="/apps">My Apps</a><span aria-hidden="true">/</span>
            {#if mode === "edit"}<a
                href={applicationUrl({
                  id: appId,
                  name: selected?.name ?? appName,
                })}>{displayName}</a
              ><span aria-hidden="true">/</span>{/if}
            <span aria-current="page"
              >{applicationCrumb(mode, displayName)}</span
            >
          {/if}
        </nav>
        <h1>{title}</h1>
        <p>
          {mode === "list"
            ? "Manage your apps and API credentials."
            : mode === "new"
              ? "Register your app to start building with Trakt."
              : mode === "edit"
                ? "Update your app details, callbacks, and allowed origins."
                : "Manage credentials and settings for this app."}
        </p>
      </div>
    </header>

    {#if error}<div class="message error" role="alert">
        {error}{#if mode !== "new"}
          <button onclick={load}>Retry</button>{/if}
      </div>{/if}
    {#if notice}<p class="message" role="status">{notice}</p>{/if}

    {#if mode === "list"}
      <div class="workspace">
        <DeveloperRail
          {profile}
          {busy}
          error={railError}
          onConnect={connect}
          onUnlink={unlink}
        />

        {#if loading}<div class="empty" role="status">Loading your apps…</div>
        {:else}<div class="app-grid">
            {#if canCreate}<a class="create-tile" href="/apps/new"
                ><span class="tile-mark" aria-hidden="true">＋</span><strong
                  >{apps.length === 0
                    ? "Create your first app"
                    : "Create app"}</strong
                >{#if apps.length === 0}<small
                    >Register an app to get your Client ID and Client Secret.</small
                  >{/if}</a
              >{:else}<div class="create-tile locked">
                <svg
                  viewBox="0 0 24 24"
                  width="24"
                  height="24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  aria-hidden="true"
                  ><rect x="5" y="11" width="14" height="9" rx="2"></rect><path
                    d="M8 11V8a4 4 0 0 1 8 0v3"
                  ></path></svg
                >
                <strong>Create app</strong><small>{createLock}</small>
              </div>{/if}
            {#each apps as app (app.id)}<a
                class="app-card"
                href={applicationUrl({ id: app.id, name: app.name })}
                ><div class="card-heading">
                  <span class="app-icon">&lt;/&gt;</span><span class="badge"
                    >{app.approved ? "Approved" : "Pending approval"}</span
                  >
                </div>
                <h2>{app.name}</h2>
                <p>{app.description || "No description yet."}</p>
                <footer>
                  <span>Created {formatDate(app.created_at)}</span><span
                    >{readOnly ? "View →" : "Manage →"}</span
                  >
                </footer></a
              >{/each}
          </div>{/if}
      </div>
    {:else if loading}
      <div class="empty" role="status">Loading app…</div>
    {:else if mode !== "new" && !selected && !error}
      <section class="empty">
        <h2>App not found</h2>
        <p>This app is unavailable for the selected account.</p>
        <a href="/apps">Back to My Apps</a>
      </section>
    {:else if mode === "new" || (mode === "edit" && selected && !readOnly)}
      <section class="panel">
        <ApplicationForm
          app={mode === "edit" ? selected : undefined}
          githubUsername={profile?.github?.username ?? null}
          {busy}
          onSave={save}
          onCancel={() => {
            void goto(
              mode === "edit"
                ? applicationUrl({ id: appId, name: selected?.name ?? appName })
                : "/apps",
            );
          }}
        />
      </section>
    {:else if selected}
      <div class="detail-grid">
        <section class="panel">
          {#each details as field (field.label)}
            <div class="credential">
              <strong>{field.label}</strong>
              <div class="credential-value">
                {#if field.code}<code>{field.value}</code>{:else}<span
                    class="field-value">{field.value}</span
                  >{/if}
                <div class="actions">
                  {#if !readOnly}<a
                      class="button"
                      href={applicationUrl({
                        id: selected.id,
                        name: selected.name,
                        edit: true,
                      })}
                      aria-label={`Edit ${field.label}`}>Edit</a
                    >{/if}
                  {#if field.label === "Redirect URIs"}<button
                      aria-label="Copy Redirect URIs"
                      onclick={() =>
                        copy(selected.redirect_uri, "Redirect URIs")}
                      >Copy</button
                    >{/if}
                </div>
              </div>
            </div>
          {/each}

          {#each credentials as field (field.label)}
            <div class="credential">
              <strong>{field.label}</strong>
              <div class="credential-value">
                <code
                  >{field.secret && !reveal
                    ? "••••••••••••••••••••••••"
                    : field.value}</code
                >
                <div class="actions">
                  {#if field.secret}<button
                      aria-label={reveal
                        ? "Hide Client Secret"
                        : "Reveal Client Secret"}
                      onclick={() => (reveal = !reveal)}
                      >{reveal ? "Hide" : "Reveal"}</button
                    >{/if}<button
                    aria-label={`Copy ${field.label}`}
                    onclick={() => copy(field.value, field.label)}>Copy</button
                  >
                </div>
              </div>
            </div>
          {/each}

          <p class="muted">
            Keep your Client Secret private. Never include it in public code or
            client-side apps.
          </p>
        </section>
        <aside class="panel">
          <h2>App details</h2>
          <dl>
            <dt>App ID</dt>
            <dd>{selected.id}</dd>
            <dt>Status</dt>
            <dd>{selected.approved ? "Approved" : "Pending approval"}</dd>
            <dt>Created</dt>
            <dd>{formatDate(selected.created_at)}</dd>
            {#if selected.approved_at}<dt>Approved</dt>
              <dd>
                {formatDate(selected.approved_at)}
              </dd>{/if}
            <dt>Permissions</dt>
            <dd>
              {applicationPermissionLabels(selected.permissions)}
            </dd>
            <dt>Scopes</dt>
            <dd>{selected.scopes.join(", ") || "None"}</dd>
          </dl>
        </aside>
      </div>

      {#if readOnly}<section class="panel">
          <h2>Editing is locked</h2>
          <p>
            Connect GitHub on <a href="/apps">My Apps</a> to edit this app. It keeps
            working for its users in the meantime, and you can still delete it below.
          </p>
        </section>{/if}

      <section class="panel danger">
        <h2>Delete app</h2>
        <p>
          Deleting this app permanently removes its credentials and disconnects
          integrations using them. This cannot be undone.
        </p>
        {#if confirming}<label
            >Type <strong>{selected.name}</strong> to confirm<input
              bind:value={confirmation}
              disabled={busy}
              autocomplete="off"
            /></label
          >
          <div class="actions">
            <button
              class="destructive"
              disabled={busy || confirmation !== selected.name}
              onclick={remove}
              >{busy ? "Deleting…" : "Permanently delete app"}</button
            ><button
              disabled={busy}
              onclick={() => {
                confirming = false;
                confirmation = "";
              }}>Cancel</button
            >
          </div>{:else}<button
            class="destructive"
            onclick={() => (confirming = true)}>Delete app</button
          >{/if}
      </section>
    {/if}
  </div>
</div>

<style lang="scss">
  @use "../../../style/action-button" as action;

  .trakt-applications {
    overflow: auto;
    padding: 48px 32px;
  }

  .content {
    max-width: 1120px;
    margin: auto;
  }

  header,
  .card-heading,
  footer,
  .actions {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 12px;
  }

  header {
    margin: 0 0 28px;
  }

  header p {
    margin: 6px 0 0;
  }

  h1 {
    font-size: 32px;
    letter-spacing: -0.04em;
    margin: 0;
  }

  h2 {
    font-size: 17px;
    margin: 0 0 12px;
  }

  p {
    color: var(--color-muted);
    line-height: 1.65;
    font-size: 14px;
  }

  button,
  .button {
    @include action.base;
  }

  .breadcrumbs {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: 8px;
    margin-bottom: 8px;
    color: var(--color-muted);
    font-size: 12px;
  }

  .breadcrumbs a {
    text-decoration: none;
  }

  .workspace {
    display: grid;
    grid-template-columns: 300px minmax(0, 1fr);
    gap: 24px;
    align-items: start;
  }

  .create-tile {
    display: grid;
    justify-items: center;
    align-content: center;
    gap: 10px;
    min-height: 200px;
    padding: 24px;
    border: 1px dashed var(--color-accent);
    border-radius: var(--radius-control);
    background: var(--color-accent-soft);
    color: var(--color-accent);
    text-align: center;
    text-decoration: none;
  }

  .create-tile strong {
    font-size: 15px;
  }

  .create-tile small {
    color: var(--color-muted);
    font-size: 12px;
    line-height: 1.5;
  }

  .tile-mark {
    font-size: 24px;
    line-height: 1;
  }

  .create-tile.locked {
    border-color: var(--color-border-strong);
    background: transparent;
    color: var(--color-muted);
  }

  .app-grid {
    display: grid;
    grid-auto-rows: 1fr;
    grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
    gap: 18px;
  }

  .app-card {
    display: flex;
    flex-direction: column;
    color: var(--color-foreground);
    text-decoration: none;
    border: 1px solid var(--color-border);
    border-radius: var(--radius-control);
    text-align: start;
    padding: 24px;
    background: var(--color-surface);
  }

  .app-card:hover {
    border-color: var(--color-border-strong);
    background: var(--color-surface-raised);
  }

  .app-card h2 {
    margin-top: 24px;
    overflow-wrap: anywhere;
  }

  .app-card p {
    min-height: 46px;
    overflow-wrap: anywhere;
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 3;
    line-clamp: 3;
    overflow: hidden;
  }

  .app-card footer {
    margin-top: auto;
  }

  .app-icon {
    font-family: var(--font-mono);
    color: var(--color-accent);
    font-size: 24px;
  }

  .badge {
    font-size: 10px;
    color: var(--color-muted);
    background: var(--color-surface-raised);
    padding: 6px 9px;
    border-radius: var(--border-radius-xl);
  }

  footer {
    border-top: 1px solid var(--color-border);
    padding-top: 18px;
    color: var(--color-muted);
    font-size: 11px;
  }

  footer span:last-child,
  a {
    color: var(--color-info);
  }

  .empty {
    display: grid;
    justify-items: center;
    gap: 14px;
    text-align: center;
    padding: 72px 20px;
    border: 1px dashed var(--color-border);
    border-radius: var(--radius-large);
  }

  .empty p,
  .empty h2 {
    margin: 0;
  }

  .empty a {
    font-size: 12px;
    margin-top: 12px;
  }

  .panel,
  aside {
    padding: 28px;
    border: 1px solid var(--color-border);
    border-radius: var(--radius-large);
    background: var(--color-surface);
    margin-bottom: 24px;
  }

  .detail-grid {
    display: grid;
    grid-template-columns: minmax(0, 2fr) minmax(220px, 1fr);
    gap: 24px;
  }

  .credential {
    display: grid;
    gap: 12px;
    padding: 22px 0;
    border-bottom: 1px solid var(--color-border);
    font-size: 12px;
  }

  .credential:first-child {
    padding-top: 0;
  }

  .field-value {
    flex: 1;
    min-width: 0;
    white-space: pre-wrap;
    overflow-wrap: anywhere;
    line-height: 1.8;
  }

  .credential-value .actions {
    flex-shrink: 0;
  }

  .credential-value {
    display: flex;
    align-items: center;
    gap: 12px;
  }

  code {
    white-space: pre-wrap;
    overflow-wrap: anywhere;
    flex: 1;
    min-width: 0;
    font-size: 12px;
    line-height: 1.8;
  }

  dt {
    color: var(--color-muted);
    font-size: 12px;
    margin-top: 24px;
  }

  dd {
    margin: 8px 0;
    font-size: 13px;
    overflow-wrap: anywhere;
  }

  .muted {
    color: var(--color-muted);
  }

  .danger {
    border-color: color-mix(
      in srgb,
      var(--color-danger) 30%,
      var(--color-border)
    );
  }

  .danger .actions {
    justify-content: start;
    margin-top: 16px;
  }

  .danger label {
    display: grid;
    gap: 8px;
    font-size: 13px;
  }

  input {
    padding: 10px;
    border: 1px solid var(--color-border);
    background: var(--color-canvas);
    max-width: 400px;
  }

  .destructive,
  .error {
    color: var(--color-danger);
  }

  .message.error {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 16px;
  }

  .message {
    margin: 0 0 24px;
    padding: 14px;
    border: 1px solid var(--color-border);
    border-radius: var(--radius-control);
  }

  @media (max-width: 900px) {
    .workspace {
      grid-template-columns: 1fr;
    }
  }

  @media (max-width: 700px) {
    .trakt-applications {
      padding: 28px 16px;
    }
    header {
      flex-wrap: wrap;
    }
    .detail-grid {
      grid-template-columns: 1fr;
      gap: 0;
    }
    .credential-value {
      flex-wrap: wrap;
    }
    .panel {
      padding: 20px;
    }
  }
</style>
