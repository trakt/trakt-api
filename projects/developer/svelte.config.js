import adapter from '@sveltejs/adapter-static';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';

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
        ],
        'font-src': ['self'],
        'form-action': ['self'],
        'frame-ancestors': ['none'],
        'img-src': [
          'self',
          'data:',
          'https://walter.trakt.tv',
          'https://media.trakt.tv',
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
