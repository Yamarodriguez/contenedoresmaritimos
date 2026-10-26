import { defineConfig } from 'astro/config';

export default defineConfig({
  site: 'https://contenedoresmaritimos.net',
  trailingSlash: 'always',
  build: {
    format: 'directory',
  },
});
