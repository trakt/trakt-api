<script lang="ts">
  import { applicationCrumb } from "./applicationCrumb.ts";
  import { applicationTitle } from "./applicationTitle.ts";
  import { applicationPermissionLabels } from "./applicationPermissionLabels.ts";
  import { applicationUrl } from "./applicationUrl.ts";
  import { formatDate } from "./formatDate.ts";
  import { goto } from "$app/navigation";
  import { onMount } from "svelte";
  import ApplicationForm from "./ApplicationForm.svelte";
  import DeveloperRail from "./DeveloperRail.svelte";
  import { listApplications } from "./listApplications.ts";
  import { saveApplication } from "./saveApplication.ts";
  import { deleteApplication } from "./deleteApplication.ts";
  import type { Application } from "./Application.ts";
  import type { ApplicationInput } from "./ApplicationInput.ts";
  import type { ApplicationsProps } from "./ApplicationsProps.ts";
  import { getDeveloperProfile } from "./getDeveloperProfile.ts";
  import { linkGithub } from "./linkGithub.ts";
  import { unlinkGithub } from "./unlinkGithub.ts";
  import type { DeveloperProfile } from "./DeveloperProfile.ts";
  import { completeGithubConnect } from "./completeGithubConnect.ts";
  import { githubConnectUrl } from "./githubConnectUrl.ts";
  import { GITHUB_CLIENT_ID } from "./GITHUB_CLIENT_ID.ts";
  import { isGithubCallback } from "./isGithubCallback.ts";
  import type { GithubConnectIntent } from "./GithubConnectIntent.ts";
  import AppSectionNav from "./AppSectionNav.svelte";
  import type { AppSection } from "./AppSection.ts";
  import MembersPanel from "./MembersPanel.svelte";
  import PkceNotice from "./PkceNotice.svelte";
  import RedirectUriWarning from "./RedirectUriWarning.svelte";
  import { unsafeRedirectUris } from "./unsafeRedirectUris.ts";
  import { developerApiHost } from "$lib/features/premium/developerApiHost.ts";
  import type { DeveloperTier } from "$lib/features/premium/DeveloperTier.ts";
  import TierBadge from "$lib/features/premium/TierBadge.svelte";
  import DeveloperPlanCard from "$lib/features/premium/DeveloperPlanCard.svelte";

  const { slot, mode, appId, appName }: ApplicationsProps = $props();
  let loading = $state(true);
  let apps = $state<Application[]>([]);
  let profile = $state<DeveloperProfile | null>(null);
  const selected = $derived(apps.find((app) => app.id === appId));
  const tier = $derived<DeveloperTier | null>(
    profile ? (profile.tier ?? "standard") : null,
  );

  function canCreateWith(
    developer: DeveloperProfile | null,
    plan: DeveloperTier | null,
  ): boolean {
    if (!developer?.github || plan === null) return false;
    if (plan !== "standard") return true;

    return developer.applications.count < developer.applications.limit;
  }

  const canCreate = $derived(canCreateWith(profile, tier));
  const readOnly = $derived(!!profile && !profile.github);
  const atLimit = $derived(!!profile?.github && !canCreate);
  const createLock = $derived(
    !profile ? "Loading…" : !profile.github ? "Connect GitHub first" : "",
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
  const unsafeRedirects = $derived(
    selected && !selected.dev ? unsafeRedirectUris(selected.redirect_uri) : [],
  );
  let busy = $state(false);
  let error = $state("");
  let railError = $state("");
  let notice = $state("");
  let reveal = $state(false);
  const ownApps = $derived(apps.filter((app) => app.role === "owner"));
  const managedApps = $derived(apps.filter((app) => app.role === "manager"));

  function cardFooter(app: Application): string {
    if (app.role === "manager") return `Owned by @${app.owner.username}`;
    if (!app.dev) return `Created ${formatDate(app.created_at)}`;
    const seats = 1 + app.manager_count + app.allowed_user_count;
    return `${seats} ${seats === 1 ? "person" : "people"} can sign in`;
  }
  let memberCountOverride = $state<number | undefined>(undefined);
  const memberCount = $derived(
    memberCountOverride ??
      (selected
        ? selected.manager_count +
          (selected.dev ? selected.allowed_user_count : 0)
        : 0),
  );
  let hash = $state("");
  $effect(() => {
    const sync = () => (hash = globalThis.location.hash.slice(1));
    sync();
    globalThis.addEventListener("hashchange", sync);
    return () => globalThis.removeEventListener("hashchange", sync);
  });
  const isOwner = $derived(selected?.role === "owner");
  const sections = $derived<AppSection[]>(
    selected
      ? [
          { id: "credentials", label: "Credentials" },
          { id: "settings", label: "Settings" },
          { id: "details", label: "Details" },
          { id: "members", label: `Members · ${memberCount}` },
          ...(isOwner ? [{ id: "delete", label: "Delete app" }] : []),
        ]
      : [],
  );
  const activeSection = $derived(
    sections.some((section) => section.id === hash)
      ? hash
      : (sections[0]?.id ?? ""),
  );
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
      if (!canCreateWith(developer, developer.tier ?? "standard")) {
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
    if (!GITHUB_CLIENT_ID) return;

    globalThis.location.assign(
      githubConnectUrl({ intent, clientId: GITHUB_CLIENT_ID }),
    );
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
        ...profile,
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

{#snippet appCard(app: Application)}
  <a class="app-card" href={applicationUrl({ id: app.id, name: app.name })}
    ><div class="card-heading">
      <span class="app-icon">&lt;/&gt;</span><span class="badges"
        >{#if app.dev}<span class="badge" data-variant="dev">Development</span
          >{/if}<span class="badge"
          >{app.approved ? "Approved" : "Pending approval"}</span
        ></span
      >
    </div>
    <h2>{app.name}</h2>
    <p>{app.description || "No description yet."}</p>
    <footer>
      <span>{cardFooter(app)}</span><span
        >{readOnly ? "View →" : "Manage →"}</span
      >
    </footer></a
  >
{/snippet}

{#snippet lockIcon()}
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
{/snippet}

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
        <div class="title-row">
          <h1>{title}</h1>
          {#if mode !== "list" && selected?.dev}<span
              class="badge"
              data-variant="dev">Development</span
            >{/if}
          {#if mode !== "list" && selected?.role === "manager"}<span
              class="badge"
              data-variant="managed">Managed</span
            >{/if}
        </div>
        <p>
          {mode === "list"
            ? "Manage your apps and API credentials."
            : mode === "new"
              ? "Register your app to start building with Trakt."
              : mode === "edit"
                ? "Update your app details, callbacks, and allowed origins."
                : selected?.role === "manager"
                  ? `Owned by @${selected.owner.username}. You can edit it as a manager.`
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
        <div class="rail-column">
          <DeveloperRail
            {profile}
            {tier}
            {busy}
            error={railError}
            canConnect={!!GITHUB_CLIENT_ID}
            onConnect={connect}
            onUnlink={unlink}
          />
          {#if profile}
            <DeveloperPlanCard
              tier={profile.tier ?? "standard"}
              count={profile.applications.count}
              limit={profile.applications.limit}
            />
          {/if}
        </div>

        {#if loading}<div class="empty" role="status">Loading your apps…</div>
        {:else}<div class="app-columns">
            <div class="app-grid">
              {#if canCreate}<a class="create-tile" href="/apps/new"
                  ><span class="tile-mark" aria-hidden="true">＋</span><strong
                    >{apps.length === 0
                      ? "Create your first app"
                      : "Create app"}</strong
                  >{#if apps.length === 0}<small
                      >Register an app to get your Client ID.</small
                    >{/if}</a
                >{:else if atLimit}<a
                  class="create-tile locked"
                  href="/premium"
                >
                  {@render lockIcon()}
                  <strong>App limit reached</strong><small
                    >Premium apps stay outside the community limit. See plans →</small
                  >
                </a>{:else}<div class="create-tile locked">
                  {@render lockIcon()}
                  <strong>Create app</strong><small>{createLock}</small>
                </div>{/if}
              {#each ownApps as app (app.id)}{@render appCard(app)}{/each}
            </div>
            {#if managedApps.length > 0}<h2 class="managed-heading">
                Managed by you
              </h2>
              <div class="app-grid">
                {#each managedApps as app (app.id)}{@render appCard(app)}{/each}
              </div>{/if}
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
      <RedirectUriWarning uris={unsafeRedirects} />

      <div class="app-layout">
        <AppSectionNav {sections} active={activeSection} />
        <div class="app-sections">
          <section
            class="panel"
            id="credentials"
            class:is-active={activeSection === "credentials"}
          >
            <h2>Credentials</h2>
            <div class="credential">
              <strong>Client ID</strong>
              <div class="credential-value">
                <code>{selected.client_id}</code>
                <div class="actions">
                  <button
                    aria-label="Copy Client ID"
                    onclick={() => copy(selected.client_id, "Client ID")}
                    >Copy</button
                  >
                </div>
              </div>
            </div>

            <PkceNotice hasSecret={!!selected.client_secret} />

            {#if selected.client_secret}<div class="credential">
                <strong
                  >Client Secret <span class="badge" data-variant="deprecated"
                    >Deprecated</span
                  ></strong
                >
                <div class="credential-value">
                  <code
                    >{reveal
                      ? selected.client_secret
                      : "••••••••••••••••••••••••"}</code
                  >
                  <div class="actions">
                    <button
                      aria-label={reveal
                        ? "Hide Client Secret"
                        : "Reveal Client Secret"}
                      onclick={() => (reveal = !reveal)}
                      >{reveal ? "Hide" : "Reveal"}</button
                    ><button
                      aria-label="Copy Client Secret"
                      onclick={() =>
                        copy(selected.client_secret ?? "", "Client Secret")}
                      >Copy</button
                    >
                  </div>
                </div>
              </div>

              <p class="muted">
                Keep your Client Secret on your server. Never include it in
                public code, websites, mobile apps, or desktop apps.
              </p>{:else}<div class="credential is-empty">
                <strong>Client Secret</strong>
                <p class="secret-placeholder">
                  Not issued. This app signs users in with PKCE, so there is no
                  secret to keep safe.
                </p>
              </div>{/if}
          </section>

          <section
            class="panel"
            id="settings"
            class:is-active={activeSection === "settings"}
          >
            <h2>Settings</h2>
            {#if readOnly}<p class="muted">
                Connect GitHub on <a href="/apps">My Apps</a> to edit this app. It
                keeps working for its users in the meantime.
              </p>{/if}
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
          </section>

          <section
            class="panel"
            id="details"
            class:is-active={activeSection === "details"}
          >
            <h2>Details</h2>
            <dl>
              <dt>App ID</dt>
              <dd>{selected.id}</dd>
              <dt>Owner</dt>
              <dd>{selected.owner.username}{isOwner ? " (you)" : ""}</dd>
              {#if !isOwner}<dt>Your role</dt>
                <dd>Manager</dd>{/if}
              <dt>Type</dt>
              <dd>{selected.dev ? "Development" : "Production"}</dd>
              <dt>Status</dt>
              <dd>{selected.approved ? "Approved" : "Pending approval"}</dd>
              <dt>Created</dt>
              <dd>{formatDate(selected.created_at)}</dd>
              {#if selected.approved_at}<dt>Approved</dt>
                <dd>
                  {formatDate(selected.approved_at)}
                </dd>{/if}
              {#if tier && isOwner}
                <dt>Plan</dt>
                <dd><TierBadge {tier} /></dd>
                <dt>API host</dt>
                <dd><code class="host">{developerApiHost(tier)}</code></dd>
              {/if}
              <dt>Permissions</dt>
              <dd>
                {applicationPermissionLabels(selected.permissions)}
              </dd>
              <dt>Scopes</dt>
              <dd>{selected.scopes.join(", ") || "None"}</dd>
            </dl>
          </section>

          <div id="members" class:is-active={activeSection === "members"}>
            <MembersPanel
              {slot}
              appId={selected.id}
              dev={selected.dev}
              {isOwner}
              ownerUsername={selected.owner.username}
              onCountChange={(count) => (memberCountOverride = count)}
            />
          </div>

          {#if isOwner}
            <section
              class="panel danger"
              id="delete"
              class:is-active={activeSection === "delete"}
            >
              <h2>Delete app</h2>
              <p>
                Deleting this app permanently removes its credentials and
                disconnects integrations using them. This cannot be undone.
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
            </section>{/if}
        </div>
      </div>
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

  .rail-column {
    display: grid;
    gap: var(--gap-l);
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

  a.create-tile.locked:hover {
    border-color: var(--color-accent);
    color: var(--color-foreground);
  }

  .host {
    flex: none;
    font-family: var(--font-mono);
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

  .title-row {
    display: flex;
    align-items: center;
    gap: var(--gap-s);
    flex-wrap: wrap;
  }

  .badges {
    display: flex;
    gap: var(--gap-xs);
    flex-wrap: wrap;
    justify-content: flex-end;
  }

  .app-columns {
    display: grid;
    gap: var(--gap-l);
    min-width: 0;
  }

  .managed-heading {
    margin: 0;
    color: var(--color-muted);
    font-size: var(--ni-12);
    letter-spacing: 0.1em;
    text-transform: uppercase;
  }

  .app-layout {
    display: grid;
    grid-template-columns: var(--ni-200) minmax(0, 1fr);
    gap: var(--gap-l);
    align-items: start;
  }

  .app-sections {
    min-width: 0;

    > [id] {
      scroll-margin-block-start: var(--gap-l);
    }

    > [id]:not(.is-active) {
      display: none;
    }
  }

  .badge[data-variant="managed"] {
    color: var(--color-info);
    background: color-mix(in srgb, var(--color-info) 14%, transparent);
    white-space: nowrap;
  }

  .badge[data-variant="dev"] {
    color: var(--color-warning);
    background: color-mix(in srgb, var(--color-warning) 14%, transparent);
    white-space: nowrap;
  }

  .badge[data-variant="deprecated"] {
    margin-inline-start: var(--gap-xs);
    color: var(--color-warning);
    background: color-mix(in srgb, var(--color-warning) 14%, transparent);
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

  .panel {
    padding: 28px;
    border: 1px solid var(--color-border);
    border-radius: var(--radius-large);
    background: var(--color-surface);
    margin-bottom: 24px;
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

  .credential.is-empty {
    border-bottom: 0;
    padding-bottom: 0;
  }

  .secret-placeholder {
    margin: 0;
    padding: var(--gap-s) var(--gap-m);
    border: var(--border-thickness-xxs) dashed var(--color-border-strong);
    border-radius: var(--radius-control);
    font-size: 12px;
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
    .app-layout {
      grid-template-columns: 1fr;
    }

    .credential-value {
      flex-wrap: wrap;
    }
    .panel {
      padding: 20px;
    }
  }
</style>
