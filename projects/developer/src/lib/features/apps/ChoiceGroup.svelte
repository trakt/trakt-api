<script lang="ts" generics="T extends string">
  import type { ChoiceGroupProps } from "./ChoiceGroupProps.ts";

  let {
    legend,
    name,
    options,
    value = $bindable(),
    hint,
  }: ChoiceGroupProps<T> = $props();

  const hintId = $props.id();
</script>

<fieldset
  class="trakt-choice-group"
  data-count={options.length}
  aria-describedby={hint ? hintId : undefined}
>
  <legend class="choice-legend">{legend}</legend>
  {#each options as option (option.value)}<label
      class="choice"
      class:is-selected={value === option.value}
      ><input
        class="choice-radio"
        type="radio"
        {name}
        value={option.value}
        bind:group={value}
      /><span class="choice-label">{option.label}</span>{#if option.hint}<small
          class="choice-hint">{option.hint}</small
        >{/if}</label
    >{/each}
  {#if hint}<small class="group-hint" id={hintId}>{hint}</small>{/if}
</fieldset>

<style lang="scss">
  .trakt-choice-group {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: var(--ni-10);
    min-width: 0;
    margin: 0;
    padding: 0;
    border: 0;

    &[data-count="3"] {
      grid-template-columns: repeat(3, minmax(0, 1fr));
    }

    @media (max-width: 640px) {
      &[data-count] {
        grid-template-columns: 1fr;
      }
    }

    .choice-legend {
      grid-column: 1 / -1;
      margin: 0;
      margin-block-end: var(--ni-10);
      padding: 0;
      font-size: var(--ni-14);
      font-weight: 600;
    }

    .choice {
      display: grid;
      grid-template-columns: auto 1fr;
      align-items: center;
      gap: var(--ni-4) var(--ni-10);
      padding: var(--ni-12);
      border: var(--border-thickness-xxs) solid var(--color-border-strong);
      border-radius: var(--radius-control);
      background: var(--color-canvas);
      font-size: 13px;
      font-weight: 600;
      cursor: pointer;

      &.is-selected {
        border-color: var(--color-accent);
        background: var(--color-accent-soft);
      }

      &:focus-within {
        outline: var(--border-thickness-xs) solid var(--color-info);
        outline-offset: var(--ni-2);
      }
    }

    .choice-radio {
      width: auto;
      margin: 0;
      accent-color: var(--color-accent);
    }

    .choice-hint {
      grid-column: 2;
      color: var(--color-muted);
      font-size: var(--ni-12);
      font-weight: 400;
      line-height: 1.5;
    }

    .group-hint {
      grid-column: 1 / -1;
      color: var(--color-muted);
      font-size: var(--ni-12);
      line-height: 1.6;
    }
  }
</style>
