<script lang="ts">
  import { onMount, tick } from "svelte";
  import ApplicationProfileCard from "./ApplicationProfileCard.svelte";
  import ApplicationProfileForm from "./ApplicationProfileForm.svelte";
  import type { ApplicationProfile } from "./ApplicationProfile.ts";
  import { applicationUrl } from "./applicationUrl.ts";
  import { DEVELOPMENT_SEAT_LIMIT } from "./DEVELOPMENT_SEAT_LIMIT.ts";
  import { getApplicationProfile } from "./getApplicationProfile.ts";
  import { getProductionReview } from "./getProductionReview.ts";
  import type { ProductionPanelProps } from "./ProductionPanelProps.ts";
  import type { ProductionReviewDetail } from "./ProductionReviewDetail.ts";
  import type { ProductionReviewInput } from "./ProductionReviewInput.ts";
  import ProductionStatusBanner from "./ProductionStatusBanner.svelte";
  import { requestProductionReview } from "./requestProductionReview.ts";

  const {
    slot,
    app,
    tier,
    readOnly,
    redirectsNeeded,
    onChanged,
  }: ProductionPanelProps = $props();

  type Editing = { prefill: "live" | "review"; asksForSecret: boolean };

  let profile = $state<ApplicationProfile | null>(null);
  let review = $state<ProductionReviewDetail | null>(null);
  let loading = $state(false);
  let editing = $state<Editing | null>(null);
  let busy = $state(false);
  let error = $state("");
  let notice = $state("");
  let alive = true;
  let title = $state<HTMLHeadingElement>();

  const isOwner = $derived(app.role === "owner");
  const status = $derived(app.production_review?.status);
  const linked = $derived(app.linked_application);
  const createsProductionApp = $derived(app.dev && !linked);
  const productionReadOnly = $derived(
    app.dev ? !!linked?.read_only : app.app_type === "production_read_only",
  );
  const fullProduction = $derived(!createsProductionApp && !productionReadOnly);
  const hasClientSecret = $derived(
    createsProductionApp
      ? false
      : app.dev
        ? !!linked?.has_client_secret
        : !!app.client_secret,
  );
  const canRequest = $derived(isOwner && !readOnly && status !== "pending");
  const reopensReview = $derived(
    status === "changes_requested" || status === "declined",
  );
  const resubmitLabel = $derived(
    status === "changes_requested"
      ? "Edit and resubmit"
      : "Request another review",
  );
  const firstLabel = $derived(
    tier === "premium" ? "Create Production app" : "Request Production access",
  );
  const formProfile = $derived(
    editing?.prefill === "review" ? (review?.profile ?? null) : profile,
  );

  onMount(() => {
    void load();
    return () => {
      alive = false;
    };
  });

  async function load() {
    const review_status = app.production_review?.status;
    const wantsReview =
      review_status === "pending" ||
      review_status === "changes_requested" ||
      review_status === "declined";
    if (!app.has_profile && !wantsReview) return;

    loading = true;
    error = "";
    try {
      const [live, latest] = await Promise.all([
        app.has_profile ? getApplicationProfile(slot, app.id) : null,
        wantsReview ? getProductionReview(slot, app.id) : null,
      ]);
      if (!alive) return;
      profile = live;
      review = latest;
    } catch (cause) {
      if (alive)
        error =
          cause instanceof Error
            ? cause.message
            : "Could not load your app information.";
    } finally {
      if (alive) loading = false;
    }
  }

  function successNotice(sent: string, createdApp: boolean): string {
    if (sent === "pending") return "Review requested.";
    return createdApp ? "Your Production app is ready." : "Changes applied.";
  }

  async function submit(input: ProductionReviewInput) {
    if (busy) return;
    busy = true;
    error = "";
    notice = "";
    try {
      const createdApp = createsProductionApp;
      const sent = await requestProductionReview({
        slot,
        appId: app.id,
        input,
      });
      if (!alive) return;
      await onChanged();
      if (!alive) return;
      editing = null;
      notice = successNotice(sent.status, createdApp);
      await tick();
      title?.focus();
      await load();
    } catch (cause) {
      if (alive)
        error =
          cause instanceof Error
            ? cause.message
            : "Could not send your request.";
    } finally {
      if (alive) busy = false;
    }
  }
</script>

<section class="trakt-production-panel">
  <h2 class="panel-title" tabindex="-1" bind:this={title}>
    {createsProductionApp ? "Production access" : "App information"}
  </h2>

  {#if linked}<p class="pair">
      {linked.dev ? "Development app" : "Production app"}:
      <a href={applicationUrl({ id: linked.id, name: linked.name })}
        >{linked.name}</a
      >
    </p>{/if}

  {#if createsProductionApp}<p class="intro">
      A Development app covers you plus up to {DEVELOPMENT_SEAT_LIMIT} people you
      invite, with any redirect URI. When {app.name} is ready for everyone, request
      Production access: you get a separate Production app with its own Client ID,
      and this one stays your sandbox.
    </p>{:else if productionReadOnly}<p class="intro">
      Read-only Production access: your Production app reads public data and
      nobody can sign in to it. To let users sign in, update your app
      information to say how they sign in and request a review.
    </p>{:else}<p class="intro">
      Changes to your app information or a Client Secret go through a review.
      Nothing changes until it's granted.
    </p>{/if}

  <div class="live" role="status">
    <ProductionStatusBanner review={app.production_review} {fullProduction} />
    {#if notice}<p class="notice">{notice}</p>{/if}
  </div>

  {#if error}<p class="error" role="alert">
      {error}{#if !editing}
        <button onclick={load}>Retry</button>{/if}
    </p>{/if}

  {#if editing}
    <ApplicationProfileForm
      appName={app.name}
      profile={formProfile}
      {createsProductionApp}
      {redirectsNeeded}
      allowsPublicDataOnly={!fullProduction}
      initialRedirects={editing.prefill === "review"
        ? (review?.redirect_uri.join("\n") ?? "")
        : ""}
      initialSecretReason={editing.prefill === "review"
        ? (review?.client_secret_reason ?? null)
        : null}
      asksForSecret={editing.asksForSecret}
      {tier}
      {hasClientSecret}
      {busy}
      onSubmit={submit}
      onCancel={() => {
        editing = null;
        error = "";
      }}
    />
  {:else if loading}
    <p class="muted" role="status">Loading app information…</p>
  {:else}
    {#if review && status !== "granted" && status !== "granted_instantly"}
      <details class="request" open={status === "pending"}>
        <summary>What you asked for</summary>
        <ApplicationProfileCard profile={review.profile} />
        {#if review.redirect_uri.length > 0}<p class="muted">
            Production redirect URIs: {review.redirect_uri.join(", ")}
          </p>{/if}
        {#if review.client_secret_reason}<p class="muted">
            Client Secret requested: {review.client_secret_reason}
          </p>{/if}
      </details>
    {/if}

    {#if profile}<h3 class="label">Current app information</h3>
      <ApplicationProfileCard
        {profile}
        updated={{
          at: profile.updated_at,
          by: profile.updated_by.username,
        }}
      />
    {:else if !app.has_profile && !createsProductionApp}<p class="muted empty">
        Add your app information so we know how {app.name} uses Trakt. It goes through
        a review like any other change.
      </p>{/if}

    {#if canRequest}<div class="actions">
        {#if reopensReview}<button
            class="primary"
            onclick={() =>
              (editing = { prefill: "review", asksForSecret: false })}
            >{resubmitLabel}</button
          >{:else if createsProductionApp}<button
            class="primary"
            onclick={() =>
              (editing = { prefill: "live", asksForSecret: false })}
            >{firstLabel}</button
          >{/if}
        {#if !createsProductionApp}<button
            class:primary={!reopensReview}
            onclick={() =>
              (editing = { prefill: "live", asksForSecret: false })}
            >{profile
              ? "Update app information"
              : "Add app information"}</button
          >{#if !hasClientSecret && !productionReadOnly}<button
              onclick={() =>
                (editing = { prefill: "live", asksForSecret: true })}
              >Request a Client Secret</button
            >{/if}{/if}
      </div>{/if}

    {#if !isOwner}<p class="muted">
        Only the owner, @{app.owner.username}, can request a review.
      </p>{/if}
  {/if}
</section>

<style lang="scss">
  @use "../../../style/action-button" as action;

  .trakt-production-panel {
    display: grid;
    gap: var(--gap-m);
    padding: 28px;
    border: var(--border-thickness-xxs) solid var(--color-border);
    border-radius: var(--radius-large);
    background: var(--color-surface);

    h2 {
      margin: 0;
      font-size: 17px;
    }

    .label {
      margin: 0;
      font-size: 13px;
      font-weight: 600;
    }

    .intro,
    .muted,
    .pair {
      margin: 0;
      color: var(--color-muted);
      font-size: 13px;
      line-height: 1.6;
    }

    .empty {
      padding: var(--gap-m);
      border: var(--border-thickness-xxs) dashed var(--color-border-strong);
      border-radius: var(--radius-control);
    }

    .request {
      display: grid;
      gap: var(--gap-s);
      padding: var(--gap-m);
      border: var(--border-thickness-xxs) solid var(--color-border);
      border-radius: var(--radius-control);

      summary {
        cursor: pointer;
        font-size: 13px;
        font-weight: 600;
      }

      &[open] summary {
        margin-block-end: var(--gap-s);
      }
    }

    .live {
      display: grid;
      gap: var(--gap-m);

      &:not(:has(*)) {
        position: absolute;
      }
    }

    .notice {
      margin: 0;
      padding: var(--gap-s) var(--gap-m);
      border: var(--border-thickness-xxs) solid var(--color-border);
      border-radius: var(--radius-control);
      font-size: 13px;
    }

    .error {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: var(--gap-m);
      margin: 0;
      color: var(--color-danger);
      font-size: 13px;
    }

    .actions {
      display: flex;
      flex-wrap: wrap;
      gap: var(--ni-10);
    }

    button {
      @include action.base;
    }

    .primary {
      @include action.primary;
    }

    a {
      color: var(--color-info);
    }

    @media (max-width: 700px) {
      padding: 20px;
    }
  }
</style>
