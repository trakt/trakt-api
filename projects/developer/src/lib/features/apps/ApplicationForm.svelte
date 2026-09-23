<script lang="ts">
  import type { Application, ApplicationInput } from "./applications.ts";
  import { parseApplication } from "./validateApplication.ts";
  const {
    app,
    githubUsername = null,
    busy,
    onSave,
    onCancel,
  }: {
    app?: Application;
    githubUsername?: string | null;
    busy: boolean;
    onSave: (input: ApplicationInput) => void;
    onCancel: () => void;
  } = $props();
  // svelte-ignore state_referenced_locally
  const initial = app;
  let name = $state(initial?.name ?? "");
  let description = $state(initial?.description ?? "");
  let redirects = $state(initial?.redirect_uri ?? "");
  let origins = $state(initial?.origins.join("\n") ?? "");
  let error = $state("");
  function submit(event: SubmitEvent) {
    event.preventDefault();
    try {
      const input = parseApplication(name, description, redirects, origins);
      error = "";
      onSave(input);
    } catch (cause) {
      error = (cause as Error).message;
    }
  }
</script>

<form onsubmit={submit}>
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
    <label
      >Redirect URIs <span
        >One per line. Custom schemes and the OAuth out-of-band URI are
        supported.</span
      ><textarea
        bind:value={redirects}
        required
        rows="4"
        placeholder="https://example.com/callback"
        spellcheck="false"></textarea></label
    >
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
        By creating an app, you agree to the <a
          href="/?section=guides&guide=create-an-app">Trakt API requirements</a
        >, including the branding and usage guidelines.
      </p>{/if}
    {#if error}<p role="alert">{error}</p>{/if}
    <div class="actions">
      <button class="primary" type="submit"
        >{busy ? "Saving…" : app ? "Save changes" : "Create app"}</button
      ><button type="button" onclick={onCancel}>Cancel</button>
    </div>
  </fieldset>
</form>

<style lang="scss">
  @use "../../../style/action-button" as action;
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
  [role="alert"] {
    color: var(--color-danger);
  }
</style>
