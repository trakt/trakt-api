<script lang="ts">
  import type { DeveloperTier } from "./DeveloperTier.ts";
  import { developerTierLabel } from "./developerTierLabel.ts";

  const {
    tier,
    withPlan = false,
  }: { tier: DeveloperTier; withPlan?: boolean } = $props();

  const label = $derived(
    withPlan ? `${developerTierLabel(tier)} Plan` : developerTierLabel(tier),
  );
</script>

<span class="trakt-tier-badge" data-tier={tier}>{label}</span>

<style lang="scss">
  .trakt-tier-badge {
    display: inline-flex;
    align-items: center;
    padding: var(--gap-xxs) var(--ni-10);
    border: var(--border-thickness-xxs) solid var(--color-border-strong);
    border-radius: var(--border-radius-xl);
    background: var(--color-surface-hover);
    color: var(--color-muted);
    font-size: var(--ni-11);
    font-weight: 600;
    letter-spacing: 0.02em;
    white-space: nowrap;
  }

  .trakt-tier-badge[data-tier="premium"] {
    border-color: transparent;
    background: color-mix(in srgb, var(--color-accent) 18%, transparent);
    color: var(--color-accent-hover);
  }
</style>
