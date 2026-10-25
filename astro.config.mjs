import { defineConfig } from 'astro/config';

// Publicado en https://natacastanoh.github.io/ACUDE (GitHub Pages distingue mayúsculas)
export default defineConfig({
  site: 'https://natacastanoh.github.io',
  base: '/ACUDE',
  trailingSlash: 'ignore',
  build: { format: 'directory' },
});
