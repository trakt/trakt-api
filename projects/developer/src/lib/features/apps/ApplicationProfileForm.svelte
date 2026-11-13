<script lang="ts">
  import { tick } from "svelte";
  import type { ApplicationProfileFormProps } from "./ApplicationProfileFormProps.ts";
  import { applicationProfileIssues } from "./applicationProfileIssues.ts";
  import { asksProductionRedirects } from "./asksProductionRedirects.ts";
  import ChoiceGroup from "./ChoiceGroup.svelte";
  import { DEVELOPMENT_SEAT_LIMIT } from "./DEVELOPMENT_SEAT_LIMIT.ts";
  import FormField from "./FormField.svelte";
  import { parseApplicationProfile } from "./parseApplicationProfile.ts";
  import { parseProductionReview } from "./parseProductionReview.ts";
  import type { ProductionFormField } from "./ProductionFormField.ts";
  import { productionReviewIssues } from "./productionReviewIssues.ts";
  import { PROFILE_SUMMARY_LIMIT } from "./PROFILE_SUMMARY_LIMIT.ts";
  import { PROFILE_SUMMARY_MINIMUM } from "./PROFILE_SUMMARY_MINIMUM.ts";
  import type { ProductionSignIn } from "./ProductionSignIn.ts";
  import { profileDraftFrom } from "./profileDraftFrom.ts";
  import { requestsClientSecret } from "./requestsClientSecret.ts";
  import { summaryCountLabel } from "./summaryCountLabel.ts";

  const {
    appName,
    profile,
    createsProductionApp,
    redirectsNeeded,
    allowsPublicDataOnly,
    initialRedirects = "",
    initialSecretReason = null,
    asksForSecret = false,
    tier,
    hasClientSecret,
    busy,
    onSubmit,
    onCancel,
  }: ApplicationProfileFormProps = $props();

  const uid = $props.id();
  // svelte-ignore state_referenced_locally
  const draft = $state(profileDraftFrom(profile));
  // svelte-ignore state_referenced_locally
  if (!allowsPublicDataOnly && draft.signIn === "none") draft.signIn = "pkce";
  let openSource = $state(draft.openSource ? "yes" : "no");
  let writes = $state(draft.writesUserData ? "writes" : "reads");
  let otherData = $state(draft.usesOtherData ? "others" : "trakt");
  let otherSync = $state(draft.syncsElsewhere ? "others" : "trakt");
  // svelte-ignore state_referenced_locally
  let redirects = $state(initialRedirects);
  // svelte-ignore state_referenced_locally
  let needsSecret = $state(
    asksForSecret || !!initialSecretReason ? "yes" : "no",
  );
  // svelte-ignore state_referenced_locally
  let secretReason = $state(initialSecretReason ?? "");
  let confirmPolicy = $state(false);
  let confirmSecret = $state(false);
  let attempted = $state(false);
  let form = $state<HTMLFormElement>();

  const premium = $derived(tier === "premium");
  const profileDraft = $derived({
    ...draft,
    openSource: openSource === "yes",
    writesUserData: writes === "writes",
    usesOtherData: otherData === "others",
    syncsElsewhere: otherSync === "others",
  });
  const reviewAnswers = $derived({
    redirectsNeeded,
    redirects,
    needsSecret: needsSecret === "yes",
    secretReason,
    confirmPolicy,
    confirmSecret,
    hasClientSecret,
  });
  const asksRedirects = $derived(
    asksProductionRedirects({ redirectsNeeded, signIn: draft.signIn }),
  );
  const wantsSecret = $derived(
    requestsClientSecret({ ...reviewAnswers, signIn: draft.signIn }),
  );
  const issues = $derived(
    attempted
      ? [
          ...applicationProfileIssues(profileDraft),
          ...productionReviewIssues({ ...reviewAnswers, signIn: draft.signIn }),
        ]
      : [],
  );
  const issueSummary = $derived(
    issues.length === 1
      ? "Fix the field marked above."
      : `Fix the ${issues.length} fields marked above.`,
  );
  const mau = $derived(Number(draft.expectedMau.trim()));
  const fewUsers = $derived(
    draft.expectedMau.trim() !== "" &&
      Number.isFinite(mau) &&
      mau <= DEVELOPMENT_SEAT_LIMIT,
  );
  const submitLabel = $derived(
    !premium
      ? "Submit for review"
      : createsProductionApp
        ? "Create Production app"
        : "Apply changes",
  );
  const signInOptions: {
    value: ProductionSignIn;
    label: string;
    hint: string;
  }[] = [
    {
      value: "none",
      label: "Public data only",
      hint: "Trending, search, ratings. No Trakt account needed.",
    },
    {
      value: "pkce",
      label: "Signs users in (PKCE)",
      hint: "Websites, mobile and desktop apps.",
    },
    {
      value: "device_code",
      label: "Signs users in (device code)",
      hint: "TV and command-line apps.",
    },
  ];
  const yesNo = [
    { value: "yes", label: "Yes" },
    { value: "no", label: "No" },
  ] as const;
  const servicesChoice = [
    { value: "trakt", label: "Only Trakt" },
    { value: "others", label: "Others too" },
  ] as const;

  function errorFor(field: ProductionFormField): string | undefined {
    return issues.find((issue) => issue.field === field)?.message;
  }

  async function submit() {
    attempted = true;
    if (issues.length > 0) {
      await tick();
      form?.querySelector<HTMLElement>('[aria-invalid="true"]')?.focus();
      return;
    }

    onSubmit(
      parseProductionReview({
        profile: parseApplicationProfile(profileDraft),
        ...reviewAnswers,
      }),
    );
  }
</script>

<form
  class="trakt-application-profile-form"
  novalidate
  aria-busy={busy}
  bind:this={form}
  onsubmit={(event) => {
    event.preventDefault();
    if (busy) return;
    void submit();
  }}
>
  <fieldset class="fields" disabled={busy}>
    <FormField
      {uid}
      field="summary"
      label="What {appName} does, and who it's for"
      hint="Between {PROFILE_SUMMARY_MINIMUM} and {PROFILE_SUMMARY_LIMIT} characters. A few plain sentences are enough. {summaryCountLabel(
        draft.summary,
      )}"
      error={errorFor("summary")}
    >
      {#snippet control(attributes)}
        <textarea
          class="control control-area"
          {...attributes}
          bind:value={draft.summary}
          required
          maxlength={PROFILE_SUMMARY_LIMIT}
          rows="3"></textarea>
      {/snippet}
    </FormField>

    <ChoiceGroup
      legend="Is your app open source?"
      name="open-source"
      options={yesNo}
      bind:value={openSource}
    />

    <FormField
      {uid}
      field="productLinks"
      label="Links to your app"
      hint="At least one, separated by commas. Repository, docs, App Store, Play Store, TestFlight, website."
      error={errorFor("productLinks")}
    >
      {#snippet control(attributes)}
        <textarea
          class="control control-area"
          {...attributes}
          bind:value={draft.productLinks}
          required
          rows="2"
          spellcheck="false"
          placeholder="https://github.com/you/app, https://example.com"
        ></textarea>
      {/snippet}
    </FormField>

    <FormField
      {uid}
      field="privacyUrl"
      label="Privacy policy"
      error={errorFor("privacyUrl")}
    >
      {#snippet control(attributes)}
        <input
          class="control"
          {...attributes}
          bind:value={draft.privacyUrl}
          type="url"
          required
          spellcheck="false"
          placeholder="https://example.com/privacy"
        />
      {/snippet}
    </FormField>

    <FormField
      {uid}
      field="noticeLinks"
      label="Where we can see your Trakt notice"
      hint={`At least one, separated by commas. The notice reads "${appName} uses Trakt but is not endorsed or certified by Trakt". A page, a README, or a screenshot or video you host is fine.`}
      error={errorFor("noticeLinks")}
    >
      {#snippet control(attributes)}
        <textarea
          class="control control-area"
          {...attributes}
          bind:value={draft.noticeLinks}
          required
          rows="2"
          spellcheck="false"
          placeholder="https://example.com/about"></textarea>
      {/snippet}
    </FormField>

    <FormField
      {uid}
      field="expectedMau"
      label="Expected monthly active users"
      hint="A rough guess is fine."
      warning={fewUsers
        ? `A Development app already covers you plus up to ${DEVELOPMENT_SEAT_LIMIT} people you invite. Apps for yourself or a few people stay on Development.`
        : undefined}
      error={errorFor("expectedMau")}
    >
      {#snippet control(attributes)}
        <input
          class="control"
          {...attributes}
          bind:value={draft.expectedMau}
          inputmode="numeric"
          required
          placeholder="2000"
        />
      {/snippet}
    </FormField>

    <ChoiceGroup
      legend="How your app uses Trakt"
      name="sign-in"
      options={allowsPublicDataOnly
        ? signInOptions
        : signInOptions.filter(({ value }) => value !== "none")}
      hint={draft.signIn === "none"
        ? "Apps that only read public data get read-only Production access: they use their own Client ID and nobody signs in. To let users sign in later, request another review."
        : undefined}
      bind:value={draft.signIn}
    />

    {#if draft.signIn !== "none"}
      <ChoiceGroup
        legend="Will it change users' Trakt data?"
        name="writes"
        options={[
          { value: "reads", label: "Read only" },
          { value: "writes", label: "Reads and writes" },
        ]}
        hint="Writes: history, scrobbles, check-ins, lists, ratings, comments."
        bind:value={writes}
      />
    {/if}

    <div class="other">
      <ChoiceGroup
        legend="Where does your app get movie and show data?"
        name="other-data"
        options={servicesChoice}
        bind:value={otherData}
      />

      {#if otherData === "others"}
        <FormField
          {uid}
          field="otherDataSources"
          label="Name them"
          size="small"
          error={errorFor("otherDataSources")}
        >
          {#snippet control(attributes)}
            <input
              class="control"
              {...attributes}
              bind:value={draft.otherDataSources}
              maxlength="255"
              required
              placeholder="Other movie and show databases you use"
            />
          {/snippet}
        </FormField>
      {/if}
    </div>

    <div class="other">
      <ChoiceGroup
        legend="Which services do users sync with?"
        name="other-sync"
        options={servicesChoice}
        bind:value={otherSync}
      />

      {#if otherSync === "others"}
        <FormField
          {uid}
          field="otherSyncServices"
          label="Name them"
          size="small"
          error={errorFor("otherSyncServices")}
        >
          {#snippet control(attributes)}
            <input
              class="control"
              {...attributes}
              bind:value={draft.otherSyncServices}
              maxlength="255"
              required
              placeholder="Other tracking services you sync with"
            />
          {/snippet}
        </FormField>
      {/if}
    </div>

    {#if asksRedirects}
      <FormField
        {uid}
        field="redirects"
        label="Production redirect URIs"
        hint="One per line. Use https:// on a domain you control. Localhost and custom app schemes stay on your Development app."
        error={errorFor("redirects")}
      >
        {#snippet control(attributes)}
          <textarea
            class="control control-area"
            {...attributes}
            bind:value={redirects}
            required
            rows="3"
            spellcheck="false"
            placeholder="https://example.com/trakt/callback"></textarea>
        {/snippet}
      </FormField>
    {/if}

    {#if !hasClientSecret && draft.signIn === "device_code"}
      <p class="secret-note">
        No Client Secret needed: device code sign-in, token refresh and revoke
        all work with your Client ID alone.
      </p>
    {:else if !hasClientSecret && draft.signIn === "pkce"}
      <div class="other">
        <ChoiceGroup
          legend="Does your server need a Client Secret?"
          name="client-secret"
          options={yesNo}
          hint="Almost never. PKCE sign-in, token refresh and revoke all work with your Client ID alone, and a secret inside an app or website is not secret. Ask only if your own server exchanges tokens. A person reviews every request."
          bind:value={needsSecret}
        />

        {#if wantsSecret}
          <FormField
            {uid}
            field="secretReason"
            label="What your server does with it"
            size="small"
            error={errorFor("secretReason")}
          >
            {#snippet control(attributes)}
              <textarea
                class="control control-area"
                {...attributes}
                bind:value={secretReason}
                required
                maxlength="500"
                rows="2"
                placeholder="Our server exchanges and refreshes tokens for self-hosted installs."
              ></textarea>
            {/snippet}
          </FormField>
        {/if}
      </div>
    {/if}

    <div class="confirmations">
      <FormField
        {uid}
        field="confirmPolicy"
        variant="check"
        error={errorFor("confirmPolicy")}
      >
        {#snippet label()}
          {appName} follows the
          <a class="policy-link" href="/docs/api-use-policy">API Use Policy</a>,
          including the Trakt notice.
        {/snippet}
        {#snippet control(attributes)}
          <input
            class="check-box"
            {...attributes}
            type="checkbox"
            bind:checked={confirmPolicy}
            required
          />
        {/snippet}
      </FormField>

      {#if wantsSecret || hasClientSecret}
        <FormField
          {uid}
          field="confirmSecret"
          variant="check"
          label="My Client Secret stays on my server. It's never inside the app people download or the site they open."
          error={errorFor("confirmSecret")}
        >
          {#snippet control(attributes)}
            <input
              class="check-box"
              {...attributes}
              type="checkbox"
              bind:checked={confirmSecret}
              required
            />
          {/snippet}
        </FormField>
      {/if}
    </div>

    <p class="disclaimer">
      {createsProductionApp && draft.signIn !== "none"
        ? "Production access lets anyone with a Trakt account sign in to your app."
        : premium
          ? "Changes apply right away. A Client Secret waits for a review."
          : "Nothing changes until the review is granted."} Granting a review is not
      an endorsement or certification of your app or how you use it. You stay responsible
      for following the API Use Policy and the law. We can remove access at any time.
    </p>

    {#if issues.length > 0}<p class="error">{issueSummary}</p>{/if}
  </fieldset>

  <div class="actions">
    <button class="action primary" type="submit" aria-disabled={busy}
      >{busy ? "Sending…" : submitLabel}</button
    ><button class="action" type="button" disabled={busy} onclick={onCancel}
      >Cancel</button
    >
  </div>
</form>

<style lang="scss">
  @use "../../../style/action-button" as action;

  .trakt-application-profile-form {
    display: grid;
    gap: var(--gap-l);

    .fields {
      display: grid;
      gap: var(--gap-l);
      min-width: 0;
      margin: 0;
      padding: 0;
      border: 0;
    }

    .control {
      width: 100%;
      padding: var(--ni-12);
      border: var(--border-thickness-xxs) solid var(--color-border);
      background: var(--color-canvas);
      font-weight: 400;

      &[aria-invalid="true"] {
        border-color: var(--color-danger);
      }
    }

    .control-area {
      resize: vertical;
    }

    .other {
      display: grid;
      gap: var(--ni-10);
    }

    .secret-note {
      margin: 0;
      color: var(--color-muted);
      font-size: var(--ni-12);
      line-height: 1.6;
    }

    .confirmations {
      display: grid;
      gap: var(--ni-10);
    }

    .check-box {
      margin-block-start: var(--ni-4);
      accent-color: var(--color-accent);
    }

    .policy-link {
      color: var(--color-info);
    }

    .disclaimer {
      margin: 0;
      padding: var(--gap-m);
      border: var(--border-thickness-xxs) solid var(--color-border);
      border-radius: var(--radius-control);
      color: var(--color-muted);
      font-size: var(--ni-12);
      line-height: 1.6;
    }

    .error {
      margin: 0;
      color: var(--color-danger);
      font-size: 13px;
    }

    .actions {
      display: flex;
      flex-wrap: wrap;
      gap: var(--ni-10);
    }

    .action {
      @include action.base;
    }

    .primary {
      @include action.primary;

      &[aria-disabled="true"] {
        opacity: 0.5;
        cursor: default;
      }
    }
  }
</style>
