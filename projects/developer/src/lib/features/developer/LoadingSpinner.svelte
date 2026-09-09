<span class="loading-spinner" aria-hidden="true"></span>

<style>
  .loading-spinner {
    display: inline-block;

    width: var(--ni-12);
    height: var(--ni-12);

    border: var(--ni-2) solid var(--color-border-strong);
    border-block-start-color: currentColor;
    border-radius: 50%;

    vertical-align: middle;

    animation: loading-spin 700ms linear infinite;
  }

  @keyframes loading-spin {
    to {
      transform: rotate(360deg);
    }
  }

  @media (prefers-reduced-motion: reduce) {
    .loading-spinner {
      animation-duration: 2s;
    }
  }
</style>
