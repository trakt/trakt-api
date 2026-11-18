import adapter from '@sveltejs/adapter-static';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';

const { PUBLIC_TRAKT_API_URL } = process.env;
const configuredApiOrigin = PUBLIC_TRAKT_API_URL?.trim()
  ? [new URL(PUBLIC_TRAKT_API_URL).origin]
  : [];

/** @type {import('@sveltejs/kit').Config} */
const config = {
  preprocess: vitePreprocess(),
  kit: {
    adapter: adapter({ fallback: '404.html' }),
    csp: {
      mode: 'hash',
      directives: {
        'default-src': ['self'],
        'base-uri': ['none'],
        'connect-src': [
          'self',
          'https://api.trakt.tv',
          'https://apiz.trakt.tv',
          'https://auth.trakt.tv',
          ...configuredApiOrigin,
        ],
        'font-src': ['self'],
        'form-action': ['self'],
        'frame-ancestors': ['none'],
        'img-src': [
          'self',
          'data:',
          'https://walter.trakt.tv',
          'https://media.trakt.tv',
          'https://avatars.githubusercontent.com',
        ],
        'object-src': ['none'],
        'script-src': ['self'],
        'style-src': ['self', 'unsafe-inline'],
      },
    },
    paths: { relative: false },
  },
};

export default config;
