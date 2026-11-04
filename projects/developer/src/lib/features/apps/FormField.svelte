<script lang="ts">
  import type { FormFieldControlAttributes } from "./FormFieldControlAttributes.ts";
  import type { FormFieldProps } from "./FormFieldProps.ts";

  const {
    uid,
    field,
    label,
    hint,
    warning,
    error,
    variant = "stacked",
    size = "default",
    control,
  }: FormFieldProps = $props();

  const id = $derived(`${uid}-${field}`);
  const describedBy = $derived(
    [hint && `${id}-hint`, warning && `${id}-warning`, error && `${id}-error`]
      .filter(Boolean)
      .join(" ") || undefined,
  );
  const attributes: FormFieldControlAttributes = $derived({
    id,
    "aria-invalid": error ? "true" : undefined,
    "aria-describedby": describedBy,
  });
</script>

{#snippet labelText()}
  {#if typeof label === "string"}{label}{:else}{@render label()}{/if}
{/snippet}

<div class="trakt-form-field" data-variant={variant} data-size={size}>
  {#if variant === "check"}
    <label class="field-label"
      >{@render control(attributes)}<span>{@render labelText()}</span></label
    >
  {:else}
    <label class="field-label" for={id}>{@render labelText()}</label>
    {#if hint}<span class="hint" id="{id}-hint">{hint}</span>{/if}
    {@render control(attributes)}
  {/if}

  {#if warning}<span class="hint is-warning" id="{id}-warning">{warning}</span
    >{/if}
  {#if error}<span class="field-error" id="{id}-error">{error}</span>{/if}
</div>

<style lang="scss">
  .trakt-form-field {
    display: grid;
    gap: var(--ni-8);

    .field-label {
      display: grid;
      gap: var(--ni-8);
      font-size: var(--ni-14);
      font-weight: 600;
    }

    &[data-size="small"] .field-label {
      font-size: 13px;
    }

    &[data-variant="check"] .field-label {
      display: flex;
      align-items: flex-start;
      gap: var(--ni-10);
      font-size: 13px;
      font-weight: 400;
      line-height: 1.6;
    }

    .hint {
      color: var(--color-muted);
      font-size: var(--ni-12);
      font-weight: 400;
      line-height: 1.6;
    }

    .is-warning {
      color: var(--color-warning);
    }

    .field-error {
      color: var(--color-danger);
      font-size: var(--ni-12);
      line-height: 1.6;
    }
  }
</style>
