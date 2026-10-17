<script lang="ts">
  import type { ApplicationFormProps } from "./ApplicationFormProps.ts";
  import { nonLocalRedirectUris } from "./nonLocalRedirectUris.ts";
  import { parseApplication } from "./parseApplication.ts";
  import RedirectUriWarning from "./RedirectUriWarning.svelte";
  import { unsafeRedirectUris } from "./unsafeRedirectUris.ts";

  const {
    app,
    githubUsername = null,
    busy,
    onSave,
    onCancel,
  }: ApplicationFormProps = $props();

  // svelte-ignore state_referenced_locally
  const initial = app;
  let name = $state(initial?.name ?? "");
  let description = $state(initial?.description ?? "");
  let redirects = $state(initial?.redirect_uri ?? "");
  let origins = $state(initial?.origins.join("\n") ?? "");
  let dev = $state(initial?.dev ?? true);
  let error = $state("");
  const unsafeRedirects = $derived(dev ? [] : unsafeRedirectUris(redirects));
  const nonLocalRedirects = $derived(
    dev ? nonLocalRedirectUris(redirects) : [],
  );

  function submit(event: SubmitEvent) {
    event.preventDefault();
    try {
      const input = parseApplication({
        name,
        description,
        redirects,
        originsText: origins,
        dev,
      });
      error = "";
      onSave(input);
    } catch (cause) {
      error = (cause as Error).message;
    }
  }
</script>

<form class="trakt-application-form" onsubmit={submit}>
  <fieldset disabled={busy}>
    {#if !app && githubUsername}<p class="creating-as">
        Creating as <strong>@{githubUsername}</strong>, your verified GitHub
        account.
      </p>{/if}

    <label
      >App name <input
        bind:value={name}
        required
        maxlength="255"
        placeholder="Your app name"
      /></label
    >

    <label
      >Description <span>Optional · Up to 255 characters</span><textarea
        bind:value={description}
        maxlength="255"
        rows="3"></textarea></label
    >

    {#if !app}<fieldset class="app-type">
        <legend class="type-legend">App type</legend>
        <label class="type-option" class:is-selected={dev}
          ><input
            class="type-radio"
            type="radio"
            name="app-type"
            value={true}
            bind:group={dev}
          />
          <strong>Development</strong>
          <small class="type-hint"
            >Only you and people you add can sign in. Redirect URIs must point
            to localhost.</small
          ></label
        ><label class="type-option" class:is-selected={!dev}
          ><input
            class="type-radio"
            type="radio"
            name="app-type"
            value={false}
            bind:group={dev}
          />
          <strong>Production</strong>
          <small class="type-hint"
            >Anyone with a Trakt account can sign in. Redirect URIs must use
            https://.</small
          ></label
        >
      </fieldset>{/if}
    <label
      >Redirect URIs <span
        >{dev
          ? "One per line. Development apps accept localhost, 127.0.0.1 or [::1] only."
          : "One per line. Use https:// only; on mobile, back it with Universal Links or verified App Links."}</span
      ><textarea
        bind:value={redirects}
        required
        rows="4"
        placeholder={dev
          ? "http://localhost:5173/callback"
          : "https://example.com/callback"}
        spellcheck="false"
        class:is-invalid={nonLocalRedirects.length > 0}
        aria-invalid={nonLocalRedirects.length > 0}
        aria-describedby={nonLocalRedirects.length > 0
          ? "redirect-error"
          : undefined}></textarea>{#if nonLocalRedirects.length > 0}<span
          class="field-error"
          id="redirect-error"
          >Development apps can only redirect to localhost. Remove {nonLocalRedirects.join(
            ", ",
          )}.</span
        >{/if}</label
    >
    <RedirectUriWarning uris={unsafeRedirects} />

    <label
      >Allowed origins <span
        >Optional · One HTTP or HTTPS origin per line, without a path.</span
      ><textarea
        bind:value={origins}
        rows="3"
        placeholder="https://example.com"
        spellcheck="false"></textarea></label
    >

    {#if !app}<p>
        By creating an app, you agree to the <a href="/docs/create-an-app"
          >Trakt API requirements</a
        >, including the branding and usage guidelines.
      </p>{/if}
    {#if error}<p role="alert">{error}</p>{/if}

    <div class="actions">
      <button
        class="primary"
        type="submit"
        disabled={nonLocalRedirects.length > 0}
        >{busy ? "Saving…" : app ? "Save changes" : "Create app"}</button
      ><button type="button" onclick={onCancel}>Cancel</button>
    </div>
  </fieldset>
</form>

<style lang="scss">
  @use "../../../style/action-button" as action;

  .trakt-application-form {
    fieldset {
      border: 0;
      padding: 0;
      display: grid;
      gap: 24px;
      min-width: 0;
    }

    label {
      display: grid;
      gap: 9px;
      font-size: 14px;
      font-weight: 600;
    }

    span,
    p {
      color: var(--color-muted);
      font-size: 12px;
      font-weight: 400;
      line-height: 1.6;
    }

    .creating-as {
      margin: 0;
      padding: 12px 16px;
      border-radius: var(--radius-control);
      border: 1px solid
        color-mix(in srgb, var(--color-success) 32%, var(--color-border));
      background: color-mix(in srgb, var(--color-success) 9%, transparent);
      color: var(--color-foreground);
      font-size: 13px;
    }

    input,
    textarea {
      width: 100%;
      font-weight: 400;
      border: 1px solid var(--color-border);
      background: var(--color-canvas);
      padding: 12px;
    }

    textarea {
      resize: vertical;
    }

    a {
      color: var(--color-info);
    }

    .actions {
      display: flex;
      gap: 10px;
    }

    button {
      @include action.base;
    }

    .primary {
      @include action.primary;
    }

    [role="alert"],
    .field-error {
      color: var(--color-danger);
    }

    .is-invalid {
      border-color: var(--color-danger);
    }

    .app-type {
      display: grid;
      grid-template-columns: repeat(2, minmax(0, 1fr));
      gap: var(--ni-10);

      @media (max-width: 640px) {
        grid-template-columns: 1fr;
      }
    }

    .type-legend {
      grid-column: 1 / -1;
      margin: 0;
      margin-block-end: var(--ni-10);
      padding: 0;
      font-size: var(--ni-14);
      font-weight: 600;
    }

    .type-option {
      display: grid;
      grid-template-columns: auto 1fr;
      align-items: center;
      gap: var(--ni-4) var(--ni-10);
      padding: var(--ni-14);
      border: var(--border-thickness-xxs) solid var(--color-border-strong);
      border-radius: var(--radius-control);
      background: var(--color-canvas);
      cursor: pointer;

      &.is-selected {
        border-color: var(--color-accent);
        background: var(--color-accent-soft);
      }

      .type-radio {
        width: auto;
        margin: 0;
        padding: 0;
        border: 0;
        accent-color: var(--color-accent);
      }

      .type-hint {
        grid-column: 2;
        color: var(--color-muted);
        font-size: var(--ni-14);
        font-weight: 400;
        line-height: 1.5;
      }
    }
  }
</style>
