import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig, loadEnv } from 'vite';

declare const process: {
  cwd(): string;
  env: Record<string, string | undefined>;
};

export default defineConfig(async ({ mode }) => {
  const { PUBLIC_TRAKT_API_URL } = loadEnv(mode, process.cwd(), 'PUBLIC_');

  // svelte.config.js builds the CSP but cannot see the Vite mode.
  if (PUBLIC_TRAKT_API_URL) {
    process.env.PUBLIC_TRAKT_API_URL = PUBLIC_TRAKT_API_URL;
  }

  return {
    plugins: [await sveltekit()],
    server: {
      port: 5174,
    },
  };
});
