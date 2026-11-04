<script lang="ts">
  import { tick } from "svelte";
  import type { ApplicationProfileFormProps } from "./ApplicationProfileFormProps.ts";
  import { applicationProfileIssues } from "./applicationProfileIssues.ts";
  import { asksProductionRedirects } from "./asksProductionRedirects.ts";
  import ChoiceGroup from "./ChoiceGroup.svelte";
  import { DEVELOPMENT_SEAT_LIMIT } from "./DEVELOPMENT_SEAT_LIMIT.ts";
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

  function describedBy(
    field: ProductionFormField,
    ...ids: ReadonlyArray<string | false>
  ): string | undefined {
    const error = !!errorFor(field) && `${uid}-${field}-error`;
    const all = [...ids, error].filter((id) => typeof id === "string");

    return all.length > 0 ? all.join(" ") : undefined;
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

{#snippet fieldError(field: ProductionFormField)}
  {@const message = errorFor(field)}
  {#if message}<span class="field-error" id="{uid}-{field}-error"
      >{message}</span
    >{/if}
{/snippet}

<form
  class="trakt-application-profile-form"
  novalidate
  bind:this={form}
  onsubmit={(event) => {
    event.preventDefault();
    void submit();
  }}
>
  <fieldset class="fields" disabled={busy}>
    <div class="field">
      <label for="{uid}-summary">What {appName} does, and who it's for</label>
      <span class="hint" id="{uid}-summary-hint"
        >Between {PROFILE_SUMMARY_MINIMUM} and {PROFILE_SUMMARY_LIMIT} characters.
        A few plain sentences are enough. {summaryCountLabel(
          draft.summary,
        )}</span
      ><textarea
        id="{uid}-summary"
        bind:value={draft.summary}
        required
        maxlength={PROFILE_SUMMARY_LIMIT}
        rows="3"
        aria-invalid={errorFor("summary") ? "true" : undefined}
        aria-describedby={describedBy("summary", `${uid}-summary-hint`)}
      ></textarea>
      {@render fieldError("summary")}
    </div>

    <ChoiceGroup
      legend="Is your app open source?"
      name="open-source"
      options={yesNo}
      bind:value={openSource}
    />

    <div class="field">
      <label for="{uid}-productLinks">Links to your app</label>
      <span class="hint" id="{uid}-productLinks-hint"
        >At least one, separated by commas. Repository, docs, App Store, Play
        Store, TestFlight, website.</span
      ><textarea
        id="{uid}-productLinks"
        bind:value={draft.productLinks}
        required
        rows="2"
        spellcheck="false"
        placeholder="https://github.com/you/app, https://example.com"
        aria-invalid={errorFor("productLinks") ? "true" : undefined}
        aria-describedby={describedBy(
          "productLinks",
          `${uid}-productLinks-hint`,
        )}></textarea>
      {@render fieldError("productLinks")}
    </div>

    <div class="field">
      <label for="{uid}-privacyUrl">Privacy policy</label><input
        id="{uid}-privacyUrl"
        bind:value={draft.privacyUrl}
        type="url"
        required
        spellcheck="false"
        placeholder="https://example.com/privacy"
        aria-invalid={errorFor("privacyUrl") ? "true" : undefined}
        aria-describedby={describedBy("privacyUrl")}
      />
      {@render fieldError("privacyUrl")}
    </div>

    <div class="field">
      <label for="{uid}-noticeLinks">Where we can see your Trakt notice</label>
      <span class="hint" id="{uid}-noticeLinks-hint"
        >At least one, separated by commas. The notice reads "{appName} uses Trakt
        but is not endorsed or certified by Trakt". A page, a README, or a screenshot
        or video you host is fine.</span
      ><textarea
        id="{uid}-noticeLinks"
        bind:value={draft.noticeLinks}
        required
        rows="2"
        spellcheck="false"
        placeholder="https://example.com/about"
        aria-invalid={errorFor("noticeLinks") ? "true" : undefined}
        aria-describedby={describedBy("noticeLinks", `${uid}-noticeLinks-hint`)}
      ></textarea>
      {@render fieldError("noticeLinks")}
    </div>

    <div class="field">
      <label for="{uid}-expectedMau">Expected monthly active users</label>
      <span class="hint" id="{uid}-expectedMau-hint"
        >A rough guess is fine.</span
      ><input
        id="{uid}-expectedMau"
        bind:value={draft.expectedMau}
        inputmode="numeric"
        required
        placeholder="2000"
        aria-invalid={errorFor("expectedMau") ? "true" : undefined}
        aria-describedby={describedBy(
          "expectedMau",
          `${uid}-expectedMau-hint`,
          fewUsers && `${uid}-expectedMau-warning`,
        )}
      />{#if fewUsers}<span
          class="hint is-warning"
          id="{uid}-expectedMau-warning"
          >A Development app already covers you plus up to {DEVELOPMENT_SEAT_LIMIT}
          people you invite. Apps for yourself or a few people stay on Development.</span
        >{/if}
      {@render fieldError("expectedMau")}
    </div>

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

    {#if draft.signIn !== "none"}<ChoiceGroup
        legend="Will it change users' Trakt data?"
        name="writes"
        options={[
          { value: "reads", label: "Read only" },
          { value: "writes", label: "Reads and writes" },
        ]}
        hint="Writes: history, scrobbles, check-ins, lists, ratings, comments."
        bind:value={writes}
      />{/if}

    <div class="other">
      <ChoiceGroup
        legend="Where does your app get movie and show data?"
        name="other-data"
        options={servicesChoice}
        bind:value={otherData}
      />
      {#if otherData === "others"}<div class="field other-name">
          <label for="{uid}-otherDataSources">Name them</label><input
            id="{uid}-otherDataSources"
            bind:value={draft.otherDataSources}
            maxlength="255"
            required
            placeholder="Other movie and show databases you use"
            aria-invalid={errorFor("otherDataSources") ? "true" : undefined}
            aria-describedby={describedBy("otherDataSources")}
          />
          {@render fieldError("otherDataSources")}
        </div>{/if}
    </div>

    <div class="other">
      <ChoiceGroup
        legend="Which services do users sync with?"
        name="other-sync"
        options={servicesChoice}
        bind:value={otherSync}
      />
      {#if otherSync === "others"}<div class="field other-name">
          <label for="{uid}-otherSyncServices">Name them</label><input
            id="{uid}-otherSyncServices"
            bind:value={draft.otherSyncServices}
            maxlength="255"
            required
            placeholder="Other tracking services you sync with"
            aria-invalid={errorFor("otherSyncServices") ? "true" : undefined}
            aria-describedby={describedBy("otherSyncServices")}
          />
          {@render fieldError("otherSyncServices")}
        </div>{/if}
    </div>

    {#if asksRedirects}<div class="field">
        <label for="{uid}-redirects">Production redirect URIs</label>
        <span class="hint" id="{uid}-redirects-hint"
          >One per line. Use https:// on a domain you control. Localhost and
          custom app schemes stay on your Development app.</span
        ><textarea
          id="{uid}-redirects"
          bind:value={redirects}
          required
          rows="3"
          spellcheck="false"
          placeholder="https://example.com/trakt/callback"
          aria-invalid={errorFor("redirects") ? "true" : undefined}
          aria-describedby={describedBy("redirects", `${uid}-redirects-hint`)}
        ></textarea>
        {@render fieldError("redirects")}
      </div>{/if}

    {#if !hasClientSecret && draft.signIn !== "none"}<div class="other">
        <ChoiceGroup
          legend="Does your server need a Client Secret?"
          name="client-secret"
          options={yesNo}
          hint="Only for servers that exchange and refresh tokens themselves. Apps and websites sign users in with PKCE or the device code flow without one."
          bind:value={needsSecret}
        />
        {#if wantsSecret}<div class="field other-name">
            <label for="{uid}-secretReason">Why your server needs it</label
            ><textarea
              id="{uid}-secretReason"
              bind:value={secretReason}
              required
              maxlength="500"
              rows="2"
              placeholder="Our server exchanges and refreshes tokens for self-hosted installs."
              aria-invalid={errorFor("secretReason") ? "true" : undefined}
              aria-describedby={describedBy("secretReason")}></textarea>
            {@render fieldError("secretReason")}
          </div>{/if}
      </div>{/if}

    <div class="confirmations">
      <div class="field">
        <label class="confirm"
          ><input
            type="checkbox"
            bind:checked={confirmPolicy}
            required
            aria-invalid={errorFor("confirmPolicy") ? "true" : undefined}
            aria-describedby={describedBy("confirmPolicy")}
          />
          <span
            >{appName} follows the
            <a href="/docs/api-use-policy">API Use Policy</a>, including the
            Trakt notice.</span
          ></label
        >
        {@render fieldError("confirmPolicy")}
      </div>
      {#if wantsSecret || hasClientSecret}<div class="field">
          <label class="confirm"
            ><input
              type="checkbox"
              bind:checked={confirmSecret}
              required
              aria-invalid={errorFor("confirmSecret") ? "true" : undefined}
              aria-describedby={describedBy("confirmSecret")}
            />
            <span
              >My Client Secret stays on my server. It's never inside the app
              people download or the site they open.</span
            ></label
          >
          {@render fieldError("confirmSecret")}
        </div>{/if}
    </div>

    <p class="disclaimer">
      {createsProductionApp && draft.signIn !== "none"
        ? "Production access lets anyone with a Trakt account sign in to your app."
        : "Nothing changes until the review is granted."} Granting a review is not
      an endorsement or certification of your app or how you use it. You stay responsible
      for following the API Use Policy and the law. We can remove access at any time.
    </p>

    {#if issues.length > 0}<p class="error">{issueSummary}</p>{/if}

    <div class="actions">
      <button class="primary" type="submit"
        >{busy ? "Sending…" : submitLabel}</button
      ><button type="button" onclick={onCancel}>Cancel</button>
    </div>
  </fieldset>
</form>

<style lang="scss">
  @use "../../../style/action-button" as action;

  .trakt-application-profile-form {
    .fields {
      display: grid;
      gap: var(--gap-l);
      min-width: 0;
      margin: 0;
      padding: 0;
      border: 0;
    }

    .field {
      display: grid;
      gap: var(--ni-8);
    }

    label {
      display: grid;
      gap: var(--ni-8);
      font-size: 14px;
      font-weight: 600;
    }

    .field-error {
      color: var(--color-danger);
      font-size: 12px;
      line-height: 1.6;
    }

    .hint {
      color: var(--color-muted);
      font-size: 12px;
      font-weight: 400;
      line-height: 1.6;
    }

    .is-warning {
      color: var(--color-warning);
    }

    input:not([type="checkbox"]),
    textarea {
      width: 100%;
      padding: var(--ni-12);
      border: var(--border-thickness-xxs) solid var(--color-border);
      background: var(--color-canvas);
      font-weight: 400;
    }

    input[aria-invalid="true"],
    textarea[aria-invalid="true"] {
      border-color: var(--color-danger);
    }

    textarea {
      resize: vertical;
    }

    .other {
      display: grid;
      gap: var(--ni-10);
    }

    .other-name label {
      font-size: 13px;
    }

    .confirmations {
      display: grid;
      gap: var(--ni-10);
    }

    .confirm {
      display: flex;
      align-items: flex-start;
      gap: var(--ni-10);
      font-size: 13px;
      font-weight: 400;
      line-height: 1.6;

      input {
        margin-block-start: var(--ni-4);
        accent-color: var(--color-accent);
      }
    }

    .disclaimer {
      margin: 0;
      padding: var(--gap-m);
      border: var(--border-thickness-xxs) solid var(--color-border);
      border-radius: var(--radius-control);
      color: var(--color-muted);
      font-size: 12px;
      line-height: 1.6;
    }

    a {
      color: var(--color-info);
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

    button {
      @include action.base;
    }

    .primary {
      @include action.primary;
    }
  }
</style>
