<script lang="ts">
  import type { FollowedUser } from "./FollowedUser.ts";
  import type { UsernameComboboxProps } from "./UsernameComboboxProps.ts";

  let {
    value = $bindable(""),
    suggestions,
    disabled,
  }: UsernameComboboxProps = $props();

  const listId = $props.id();
  let open = $state(false);
  let highlighted = $state(0);
  const visible = $derived(open && suggestions.length > 0);

  function pick(person: FollowedUser) {
    value = person.username;
    open = false;
  }

  function onkeydown(event: KeyboardEvent) {
    if (!visible) return;
    if (event.key === "ArrowDown") {
      event.preventDefault();
      highlighted = (highlighted + 1) % suggestions.length;
    } else if (event.key === "ArrowUp") {
      event.preventDefault();
      highlighted = (highlighted - 1 + suggestions.length) % suggestions.length;
    } else if (event.key === "Enter") {
      event.preventDefault();
      pick(suggestions[highlighted]);
    } else if (event.key === "Escape") {
      open = false;
    }
  }
</script>

<div class="trakt-username-combobox">
  <label class="field-label" for={`${listId}-input`}>Trakt username</label>
  <input
    id={`${listId}-input`}
    class="username-input"
    role="combobox"
    aria-autocomplete="list"
    aria-expanded={visible}
    aria-controls={listId}
    aria-activedescendant={visible ? `${listId}-${highlighted}` : undefined}
    placeholder="Trakt username"
    autocomplete="off"
    spellcheck="false"
    {disabled}
    bind:value
    oninput={() => {
      open = true;
      highlighted = 0;
    }}
    onfocus={() => (open = true)}
    onblur={() => (open = false)}
    {onkeydown}
  />
  {#if visible}<ul class="suggestions" id={listId} role="listbox">
      {#each suggestions as person, index (person.slug)}<li
          class="suggestion"
          id={`${listId}-${index}`}
          role="option"
          aria-selected={index === highlighted}
          class:is-highlighted={index === highlighted}
          onmousedown={(event) => {
            event.preventDefault();
            pick(person);
          }}
        >
          {person.username}
        </li>{/each}
    </ul>{/if}
</div>

<style lang="scss">
  .trakt-username-combobox {
    position: relative;
    min-width: 0;

    .username-input {
      inline-size: 100%;
      block-size: var(--ni-44);
      padding-inline: var(--ni-12);
      border: var(--border-thickness-xxs) solid var(--color-border);
      border-radius: var(--radius-control);
      background: var(--color-canvas);
    }

    .field-label {
      position: absolute;
      inline-size: var(--ni-1);
      block-size: var(--ni-1);
      overflow: hidden;
      clip: rect(0 0 0 0);
    }

    .suggestions {
      position: absolute;
      inset-block-start: calc(100% + var(--ni-4));
      inset-inline: 0;
      z-index: 2;
      display: grid;
      margin: 0;
      padding: var(--ni-4);
      list-style: none;
      border: var(--border-thickness-xxs) solid var(--color-border-strong);
      border-radius: var(--radius-control);
      background: var(--color-surface-raised);
    }

    .suggestion {
      padding: var(--ni-10) var(--ni-12);
      border-radius: var(--radius-small);
      cursor: pointer;

      &.is-highlighted {
        background: var(--color-surface-hover);
      }
    }
  }
</style>
