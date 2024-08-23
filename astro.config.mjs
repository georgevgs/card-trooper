import { defineConfig } from 'astro/config';
import react from "@astrojs/react";
import tailwind from "@astrojs/tailwind";
import db from "@astrojs/db";
import netlify from "@astrojs/netlify";

import webVitals from "@astrojs/web-vitals";

// https://astro.build/config
export default defineConfig({
  integrations: [react(), tailwind(), db(), webVitals()],
  output: 'server',
  adapter: netlify()
});