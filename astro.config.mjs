// @ts-check
import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';
import vercel from '@astrojs/vercel';
import { loadEnv } from 'vite';

const env = loadEnv(process.env.NODE_ENV || 'development', process.cwd(), '');

// https://astro.build/config
export default defineConfig({
  integrations: [tailwind()],
  output: 'server', // Enable API routes
  adapter: vercel(), // Add Vercel adapter for server-side rendering
  markdown: {
    // Configure markdown options
    remarkPlugins: [],
    rehypePlugins: [],
    // Don't preserve hard line breaks - treat them as spaces
    gfm: true,
    // Configure remark to handle paragraphs properly
    remarkRehype: {
      footnoteLabelProperties: {},
      footnoteBackLabelProperties: {},
    }
  },
  vite: {
    define: {
      'process.env.HUBSPOT_ACCESS_TOKEN': JSON.stringify(env.HUBSPOT_ACCESS_TOKEN),
      'process.env.HUBSPOT_PORTAL_ID': JSON.stringify(env.HUBSPOT_PORTAL_ID),
      'process.env.SITE_URL': JSON.stringify(env.SITE_URL)
    }
  }
});
