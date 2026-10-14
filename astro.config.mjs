// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import tailwindcss from '@tailwindcss/vite';

// https://astro.build/config
export default defineConfig({
  // Canonical origin: used for canonical URLs, Open Graph URLs and the sitemap.
  site: 'https://emadgohari.com',
  integrations: [
    sitemap({
      // /resume is only the source for the PDF; keep it out of search results.
      filter: (page) => !page.replace(/\/$/, '').endsWith('/resume'),
    }),
  ],
  vite: {
    plugins: [tailwindcss()]
  }
});
